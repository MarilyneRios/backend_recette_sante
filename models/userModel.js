import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import uid2 from "uid2";

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      unique: true,
      // Générer un token par défaut lors de la création de l'utilisateur
      default: function () {
        return uid2(32);
      },
    },
    savedRecipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
  },
  // La date et l’heure de création ou modication du document
  // Mongoose ajoute automatiquement les champs createdAt et updatedAt
  {
    timestamps: true,
  }
);

// Crypter le mot de passe avec bcrypt avant de le sauvegarder dans la base de données
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  // Salt pour renforcer la sécurité du hachage du mot de passe
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Vérifier si le mot de passe saisi = mot de passe haché dans la base de données
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

export default User;
