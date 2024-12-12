import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SignupForm() {
  const [passMismatch, setPassMismatch] = useState(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) {
        error = "Name is required";
      }
    } else if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Valid email is required";
      }
    } else if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
      }
    } else if (name === "confirmPassword") {
      if (!value.trim()) {
        error = "Confirm Password is required";
      }
    }

    return error;
  };

  const handleFormData = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  async function handleForm(event) {
    event.preventDefault();

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField(
        "confirmPassword",
        formData.confirmPassword
      ),
    };
    if (!(formData.confirmPassword === formData.password)) {
      setPassMismatch("Password mismatch");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors.length === 0)) {
      console.log("Form submitted successfully", formData);
      try {
        setErrors("");
        setLoading(true);
        await signup(formData.email, formData.password, formData.name);
        navigate("/dashboard");
      } catch (error) {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          alert("Bro, you are already in my friendlist, just login");
        }
        setLoading(false);
        setErrors("Failed to create an account");
      }
    }
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create an Account
        </h2>
        <form
          onSubmit={handleForm}
          action="#"
          method="POST"
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter your full name"
              onChange={handleFormData}
              value={formData.name}
            />
            {errors.name && (
              <p className="text-sm mt-1 ml-1 text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Enter your email"
              onChange={handleFormData}
              value={formData.email}
            />
            {errors.email && (
              <p className="text-sm mt-1 ml-1 text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Create a password"
              onChange={handleFormData}
              value={formData.password}
            />
            {errors.password && (
              <p className="text-sm mt-1 ml-1 text-red-500">
                {errors.password}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              placeholder="Confirm your password"
              onChange={handleFormData}
              value={formData.confirmPassword}
            />
            {errors.confirmPassword && (
              <p className="text-sm mt-1 ml-1 text-red-500">
                {errors.confirmPassword}
              </p>
            )}
            {passMismatch && (
              <p className="text-sm mt-1 ml-1 text-red-500">{passMismatch}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?
          <Link to="/" className="text-blue-600 ml-2 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
