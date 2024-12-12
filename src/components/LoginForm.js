import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginForm() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Reusable validation function
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        error = "Valid email is required";
      }
    } else if (name === "password") {
      if (!value.trim()) {
        error = "Password is required";
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
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      console.log("Form submitted successfully", formData);
      try {
        setErrors("");
        setLoading(true);
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } catch (error) {
        console.log("Firebase login error object:", error);
        if (error.code === "auth/invalid-credential") {
          alert("Bro, its invalid credentials. Please check your email and password.");
        } else {
          alert("An error occurred. Please try again, bro!");
        }
        setLoading(false);
      }
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Login
      </h2>
      <form onSubmit={handleForm} className="space-y-4">
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
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-gray-900"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleFormData}
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
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 text-gray-900"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleFormData}
          />
          {errors.password && (
            <p className="text-sm mt-1 ml-1 text-red-500">{errors.password}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?
        <Link to="/signup" className="text-blue-600 ml-2 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
