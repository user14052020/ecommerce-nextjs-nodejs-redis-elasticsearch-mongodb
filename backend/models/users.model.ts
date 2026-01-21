import bcrypt from "bcryptjs";
import mongoose, {
  CallbackWithoutResultAndOptionalError,
  Document,
  Schema,
} from "mongoose";

type UserAddress = {
  type: boolean;
  name?: string;
  country_id?: string;
  state_id?: string;
  city_id?: string;
  town_id?: string;
  district_id?: string;
  village_id?: string;
  address?: string;
};

type UserRole = Record<string, boolean>;

export interface UsersDocument extends Document {
  created_user: Record<string, unknown>;
  isActive: boolean;
  isCustomer: boolean;
  name?: string;
  surname?: string;
  username: string;
  password: string;
  role: UserRole;
  image?: string;
  company?: string;
  taxoffice?: string;
  taxnumber?: string;
  ssn?: string;
  executive?: string;
  phone?: string;
  prefix?: string;
  fax?: string;
  web?: string;
  risk?: number;
  address: UserAddress[];
  spesific_id?: string;
  resetPasswordToken: string;
  resetPasswordExpires: Date;
  comparePassword: (
    password: string,
    cb: (err: Error | null, result: UsersDocument | boolean | null) => void
  ) => void;
}

const UsersSchema = new Schema<UsersDocument>(
  {
    created_user: {
      required: true,
      type: Schema.Types.Mixed,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    isCustomer: {
      type: Boolean,
      required: true,
      default: true,
    },
    name: {
      type: String,
    },
    surname: {
      type: String,
    },

    username: {
      type: String,
      required: true,
      min: 6,
      max: 15,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Schema.Types.Mixed,
      default: {},
    },

    image: {
      type: String,
    },
    company: {
      type: String,
      trim: true,
    },

    taxoffice: {
      type: String,
      trim: true,
    },

    taxnumber: {
      type: String,
    },

    ssn: {
      type: String,
    },
    executive: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    prefix: {
      type: String,
    },
    fax: {
      type: String,
    },
    web: {
      type: String,
    },
    risk: {
      type: Number,
    },

    address: [
      {
        type: {
          type: Boolean,
          default: true,
        },
        name: {
          type: String,
        },
        country_id: {
          type: String,
          default: "Turkey",
        },
        state_id: {
          type: String,
        },
        city_id: {
          type: String,
        },
        town_id: {
          type: String,
        },
        district_id: {
          type: String,
        },
        village_id: {
          type: String,
        },
        address: {
          type: String,
        },
      },
    ],

    spesific_id: {
      type: String,
    },

    resetPasswordToken: {
      type: String,
      default: "asdasdasdas--example--6yhjkoıu7654esxcvbhythbvfde45ty",
    },
    resetPasswordExpires: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

UsersSchema.pre("save", function (
  this: UsersDocument,
  next: CallbackWithoutResultAndOptionalError
) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

UsersSchema.methods.comparePassword = function (
  this: UsersDocument,
  password: string,
  cb: (err: Error | null, result: UsersDocument | boolean | null) => void
) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err, null);
    if (!isMatch) return cb(null, isMatch);
    return cb(null, this);
  });
};

const Users = mongoose.model<UsersDocument>("Users", UsersSchema);
export default Users;
