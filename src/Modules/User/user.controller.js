import { Router } from "express";
const router = Router();
import * as userServices from "./user.services.js";
import {
    fileValidation,
    fileValidationMagic,
    localUploadFile,
} from "../../Utils/Multer/local.multer.js";
import { authentication, authorization, tokenTypeEnum } from "../../Middleware/auth.middleware.js";
import { validate } from "../../Middleware/validation.middleware.js";
import { coverImageSchema, freezeAcountSchema, profileImageSchema, restoreAcountSchema } from "./user.validation.js";
import { cloudUploadFile } from "../../Utils/Multer/cloud.multer.js";
import { roleEnum } from "../../DB/Models/user.model.js";

router.get("/", userServices.listUsers);

router.patch("/update",  authorization({tokenType : tokenTypeEnum.ACCESS}) , authentication({accessRole : [roleEnum.USER]}) ,userServices.updateProfile);

router.patch(
    "/profile-image",
    authorization({tokenType : tokenTypeEnum.ACCESS}),
    authentication({accessRole : [roleEnum.USER]}),
    localUploadFile({
    customPath: "User",
    validation: [...fileValidation.images],
    }).single("profileImage"),
    validate(profileImageSchema),
    fileValidationMagic,
    userServices.profileImage
);

router.patch(
    "/profile-image-cloud",
    authorization,
    authentication({accessRole : ["USER"]}),
    cloudUploadFile({validation : [...fileValidation.images]}).single("cloudImage"),
    fileValidationMagic,
    userServices.profileImageCloud
);

router.patch(
    "/coverImage",
    authorization,
    localUploadFile({
    customPath: "User",
    validation: [...fileValidation.images],
    }).array("coverImages", 4),
    validate(coverImageSchema),
    userServices.coverImage
);

router.patch(
    "/coverImageCloud",
    authorization,
    cloudUploadFile({
        validation : [...fileValidation.images]
    }).array(
        "coverImage",
        5
    ),
    userServices.coverImageUpload
);

router.delete(
    "{/:userId}/freeze-account",
    authorization({tokenType : tokenTypeEnum.ACCESS}),
    authentication({accessRole : [roleEnum.ADMIN , roleEnum.USER]}),
    validate(freezeAcountSchema),
    userServices.freezeAccount
);

router.patch(
    "/:userId/restore-account",
    authorization({tokenType : tokenTypeEnum.ACCESS}),
    authentication({accessRole : [roleEnum.ADMIN , roleEnum.USER]}),
    validate(restoreAcountSchema),
    userServices.restoreAccount
);

export default router;
