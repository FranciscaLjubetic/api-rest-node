const express = require("express");
const multer = require("multer");
const ArticleController = require("../controllers/Articles");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './images/articles');
    },
    filename: function(req, file, cb){
        cb(null, "article" + Date.now() +file.originalname);
    }
})

const uploadings = multer({storage: storage});




router.get("/test", ArticleController.test);
router.get("/curso", ArticleController.curso);

router.post("/create", ArticleController.createArticle);
router.put("/:id", ArticleController.updateArticle);
router.delete("/:id", ArticleController.deleteArticle);
router.get("/all/:ultimos?", ArticleController.readArticles);
router.get("/:id", ArticleController.findArticleById);
router.post("/uploadimage/:id", [uploadings.single("file")], ArticleController.uploadImage);
router.get("/image/:file", ArticleController.image);
router.get("/search/:string", ArticleController.search);

module.exports = router;