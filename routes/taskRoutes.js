const express = require("express");
const fs = require("fs");
const validateTask = require("../middleware/validation");

const router = express.Router();

const tasksFile = "./data/tasks.json";

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Görevleri listele
 *     description: Görevleri filtreleme, arama ve sayfalama seçenekleriyle listeler.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Görev durumuna göre filtreler.
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Önceliğe göre filtreler.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Başlık, açıklama, ders veya atanan kişide arama yapar.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Sayfa başına görev sayısı.
 *     responses:
 *       200:
 *         description: Görevler başarıyla getirildi.
 *       500:
 *         description: Görevler okunamadı.
 */

router.get("/", (req, res) => {
    fs.readFile(tasksFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Görevler okunamadı."
            });
        }

        let tasks = JSON.parse(data);

        const { status, priority, search } = req.query;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }

        if (priority) {
            tasks = tasks.filter(task => task.priority === priority);
        }

        if (search) {
            const searchText = search.toLowerCase();

            tasks = tasks.filter(task =>
                task.title.toLowerCase().includes(searchText) ||
                task.description.toLowerCase().includes(searchText) ||
                task.course.toLowerCase().includes(searchText) ||
                task.assignee.toLowerCase().includes(searchText)
            );
        }

        const totalTasks = tasks.length;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedTasks = tasks.slice(startIndex, endIndex);

        res.json({
            page: page,
            limit: limit,
            totalTasks: totalTasks,
            totalPages: Math.ceil(totalTasks / limit),
            tasks: paginatedTasks
        });
    });
});
/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: ID ile görev getir
 *     description: Belirtilen ID'ye sahip tek bir görevi getirir.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Görevin ID numarası.
 *     responses:
 *       200:
 *         description: Görev başarıyla getirildi.
 *       404:
 *         description: Görev bulunamadı.
 *       500:
 *         description: Görevler okunamadı.
 */
router.get("/:id", (req, res) => {
    fs.readFile(tasksFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Görevler okunamadı."
            });
        }

        const tasks = JSON.parse(data);

        const id = parseInt(req.params.id);

        const task = tasks.find(task => task.id === id);

        if (!task) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        res.json(task);
    });
});
/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Yeni görev oluştur
 *     description: Sisteme yeni bir görev ekler.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - course
 *               - priority
 *               - status
 *               - dueDate
 *               - assignee
 *             properties:
 *               title:
 *                 type: string
 *                 example: Veritabanı ödevini tamamla
 *               description:
 *                 type: string
 *                 example: SQL Server ödevini tamamla.
 *               course:
 *                 type: string
 *                 example: Backend Development
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               status:
 *                 type: string
 *                 example: pending
 *               dueDate:
 *                 type: string
 *                 example: 2026-10-10
 *               assignee:
 *                 type: string
 *                 example: Deniz
 *     responses:
 *       201:
 *         description: Görev başarıyla oluşturuldu.
 *       400:
 *         description: Geçersiz görev verisi.
 *       500:
 *         description: Görev kaydedilemedi.
 */
router.post("/", validateTask, (req, res) => {
    fs.readFile(tasksFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Görevler okunamadı."
            });
        }

        const tasks = JSON.parse(data);

        const newTask = {
            id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
            title: req.body.title,
            description: req.body.description,
            course: req.body.course,
            priority: req.body.priority,
            status: req.body.status,
            dueDate: req.body.dueDate,
            assignee: req.body.assignee
        };

        tasks.push(newTask);

        fs.writeFile(
            tasksFile,
            JSON.stringify(tasks, null, 4),
            "utf8",
            (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Görev kaydedilemedi."
                    });
                }

                res.status(201).json({
                    message: "Görev başarıyla oluşturuldu.",
                    task: newTask
                });
            }
        );
    });
});
/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Görevi güncelle
 *     description: Belirtilen ID'ye sahip görevin bilgilerini günceller.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Güncellenecek görevin ID numarası.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - course
 *               - priority
 *               - status
 *               - dueDate
 *               - assignee
 *             properties:
 *               title:
 *                 type: string
 *                 example: Veritabanı ödevini tamamla
 *               description:
 *                 type: string
 *                 example: SQL Server ödevi tamamlandı.
 *               course:
 *                 type: string
 *                 example: Backend Development
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: high
 *               status:
 *                 type: string
 *                 example: completed
 *               dueDate:
 *                 type: string
 *                 example: 2026-10-10
 *               assignee:
 *                 type: string
 *                 example: Deniz
 *     responses:
 *       200:
 *         description: Görev başarıyla güncellendi.
 *       400:
 *         description: Geçersiz görev verisi.
 *       404:
 *         description: Görev bulunamadı.
 *       500:
 *         description: Görev güncellenemedi.
 */
router.put("/:id", validateTask, (req, res) => {
    fs.readFile(tasksFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Görevler okunamadı."
            });
        }

        const tasks = JSON.parse(data);

        const id = parseInt(req.params.id);

        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        const updatedTask = {
            id: id,
            title: req.body.title,
            description: req.body.description,
            course: req.body.course,
            priority: req.body.priority,
            status: req.body.status,
            dueDate: req.body.dueDate,
            assignee: req.body.assignee
        };

        tasks[taskIndex] = updatedTask;

        fs.writeFile(
            tasksFile,
            JSON.stringify(tasks, null, 4),
            "utf8",
            (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Görev güncellenemedi."
                    });
                }

                res.json({
                    message: "Görev başarıyla güncellendi.",
                    task: updatedTask
                });
            }
        );
    });
});
/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Görevi sil
 *     description: Belirtilen ID'ye sahip görevi sistemden siler.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Silinecek görevin ID numarası.
 *     responses:
 *       200:
 *         description: Görev başarıyla silindi.
 *       404:
 *         description: Görev bulunamadı.
 *       500:
 *         description: Görev silinemedi.
 */
router.delete("/:id", (req, res) => {
    fs.readFile(tasksFile, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Görevler okunamadı."
            });
        }

        const tasks = JSON.parse(data);

        const id = parseInt(req.params.id);

        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];

        fs.writeFile(
            tasksFile,
            JSON.stringify(tasks, null, 4),
            "utf8",
            (err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Görev silinemedi."
                    });
                }

                res.json({
                    message: "Görev başarıyla silindi.",
                    task: deletedTask
                });
            }
        );
    });
});

module.exports = router;