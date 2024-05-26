import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: (props) =>
        `${props.value} ¡No es una contraseña válida! La contraseña debe contener al menos una letra mayúscula, un número y tener al menos 8 caracteres.`,
    },
  },
  createdOn: { type: Date, default: new Date().getTime() },
});

export default mongoose.model("User", userSchema);
