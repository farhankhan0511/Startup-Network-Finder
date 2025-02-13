import { Router } from "express";
import { Searchcontrol } from "../controllers/Search.controller";
import { authenticateOAuth } from "../middlewares/auth.middleware";


const router=Router()
router.route("/search").post(authenticateOAuth,Searchcontrol)

export default router;