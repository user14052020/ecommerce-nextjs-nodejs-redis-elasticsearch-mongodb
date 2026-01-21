import { Router, Request, Response } from "express";
import path from "path";
import multer from "multer";
import passport from "passport";
import { asyncHandler } from "@app/middleware/asyncHandler";
import { getUploadService } from "@app/core/dependencies";
import { AuthenticatedRequest } from "@app/types/request";

const router = Router();

type UploadRequest = AuthenticatedRequest & {
  file?: Express.Multer.File;
};

type PathBody = { path: string };

const adminPublicDir = path.resolve(process.cwd(), "admin", "public");
const adminPublicPrefix = "/admin/public";

const toPublicPath = (absolutePath: string) => {
  const relative = absolutePath.replace(adminPublicDir, "").replace(/\\/g, "/");
  return `${adminPublicPrefix}${relative.startsWith("/") ? "" : "/"}${relative}`;
};

const toAbsolutePublicPath = (publicPath: string) => {
  const normalized = publicPath.startsWith(adminPublicPrefix)
    ? publicPath.slice(adminPublicPrefix.length)
    : publicPath;
  const trimmed = normalized.replace(/^\//, "");
  return path.join(adminPublicDir, trimmed);
};

const baseImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/GIF",
];
const imageTypesWithSvg = [...baseImageTypes, "image/svg+xml"];

const createStorage = (subdir: string) =>
  multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.join(adminPublicDir, "images", "uploads", subdir));
    },
    filename: function (_req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });

const createFileFilter = (allowedFileTypes: string[]) => {
  return (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    cb(null, allowedFileTypes.includes(file.mimetype));
  };
};

const uploadImage = async (req: Request): Promise<string> => {
  const service = getUploadService();
  const targetPath = path.join(
    adminPublicDir,
    "images",
    "uploads",
    "staff",
    `${Date.now()}.png`
  );
  const savedPath = await service.writeBase64Image(
    targetPath,
    (req as Request).body as Record<string, unknown>[]
  );
  return toPublicPath(savedPath);
};

router.post(
  "/uploadstaffavatar",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "staff/add");
    const savedPath = await uploadImage(req);
    return res.send(savedPath);
  })
);

router.post(
  "/deletestaffavatar",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "staff/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

const uploadImageCustomer = async (req: Request): Promise<string> => {
  const service = getUploadService();
  const targetPath = path.join(
    adminPublicDir,
    "images",
    "uploads",
    "customers",
    `${Date.now()}.png`
  );
  const savedPath = await service.writeBase64Image(
    targetPath,
    (req as Request).body as Record<string, unknown>[]
  );
  return toPublicPath(savedPath);
};

router.post(
  "/uploadcustomersavatar",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "customers/add");
    const savedPath = await uploadImageCustomer(req);
    return res.send(savedPath);
  })
);

router.post(
  "/deletecustomersavatar",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "customers/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

const storageProduct = createStorage("products");
const fileFilterProduct = createFileFilter(baseImageTypes);

let uploadproductimage = multer({
  storage: storageProduct,
  fileFilter: fileFilterProduct,
});

router.post(
  "/uploadproductimage",
  passport.authenticate("jwt", { session: false }),
  uploadproductimage.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole((req as AuthenticatedRequest).user, "productimages/add");
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deleteproductimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "productimages/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

//cargo image manage

const storageCargo = createStorage("cargoes");
const fileFilterCargo = createFileFilter(baseImageTypes);

let uploadimagecargo = multer({
  storage: storageCargo,
  fileFilter: fileFilterCargo,
});

router.post(
  "/uploadcargoimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagecargo.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole((req as AuthenticatedRequest).user, "cargoes/add");
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deletecargoimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "cargoes/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

//orderstatus image manage

const storageOrderstatus = createStorage("orderstatus");
const fileFilterOrderstatus = createFileFilter(imageTypesWithSvg);

let uploadimageorderstatus = multer({
  storage: storageOrderstatus,
  fileFilter: fileFilterOrderstatus,
});

router.post(
  "/uploadorderstatusimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageorderstatus.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole((req as AuthenticatedRequest).user, "orderstatus/add");
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deleteorderstatusimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "orderstatus/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

//payment methods image manage

const storagePaymentmethods = createStorage("paymentmethods");
const fileFilterPaymentmethods = createFileFilter(imageTypesWithSvg);

let uploadimagepaymentmethods = multer({
  storage: storagePaymentmethods,
  fileFilter: fileFilterPaymentmethods,
});

router.post(
  "/uploadpaymentmethodsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagepaymentmethods.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole(
        (req as AuthenticatedRequest).user,
        "paymentmethods/add"
      );
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deletepaymentmethodsimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole(
      (req as AuthenticatedRequest).user,
      "paymentmethods/id"
    );
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

//brands image manage

const storageBrands = createStorage("brands");
const fileFilterBrands = createFileFilter(imageTypesWithSvg);

let uploadimageBrands = multer({
  storage: storageBrands,
  fileFilter: fileFilterBrands,
});

router.post(
  "/uploadbrandsimage",
  passport.authenticate("jwt", { session: false }),
  uploadimageBrands.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole((req as AuthenticatedRequest).user, "brands/add");
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deletebrandsimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "brands/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

//homeslider image manage

const storagehomeslider = createStorage("homeslider");
const fileFilterhomeslider = createFileFilter(baseImageTypes);

let uploadimagehomeslider = multer({
  storage: storagehomeslider,
  fileFilter: fileFilterhomeslider,
});

router.post(
  "/uploadhomesliderimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagehomeslider.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureRole((req as AuthenticatedRequest).user, "homeslider/add");
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deletehomesliderimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureRole((req as AuthenticatedRequest).user, "homeslider/id");
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);



//Logo image manage

const storageLogo = createStorage("logo");
const fileFilterLogo = createFileFilter(baseImageTypes);

let uploadimagelogo = multer({
  storage: storageLogo,
  fileFilter: fileFilterLogo,
});

router.post(
  "/uploadlogoimage",
  passport.authenticate("jwt", { session: false }),
  uploadimagelogo.single("image"),
    asyncHandler(async (req: Request, res: Response) => {
      const service = getUploadService();
      service.ensureSuperadmin((req as AuthenticatedRequest).user);
      const uploadReq = req as UploadRequest;
      if (!uploadReq.file) {
        return res.send("Image upload failed");
      }
      return res.json({
        msg: "image successfully uploaded",
        path: toPublicPath(uploadReq.file.path),
      });
    })
);

router.post(
  "/deletelogoimage",
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const service = getUploadService();
    service.ensureSuperadmin((req as AuthenticatedRequest).user);
    await service.deleteFile(
      toAbsolutePublicPath(((req.body as PathBody).path || ""))
    );
    res.json({ msg: "image deleted" });
  })
);

export default router;
