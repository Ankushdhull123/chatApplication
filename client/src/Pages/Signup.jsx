import { useState } from "react";
import axios from "axios";
import './Signup.css'

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    description: "",
    img: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, img: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("phone", formData.phone);
    data.append("description", formData.description);
    data.append("img", formData.img);

    try {
      const response = await axios.post("http://localhost:5000/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      alert("User registered successfully!");
    } catch (error) {
      console.error(error);
      alert("Error registering user.");
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="file" name="img" onChange={handleFileChange} accept="image/*" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Signup;
