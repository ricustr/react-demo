import React, { useState } from "react";

interface FormData {
  nickname: string;
  email: string;
  password: string;
}

interface FormErrors {
  nickname: string[];
  email: string[];
  password: string[];
}

const NewPageSignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    nickname: [],
    email: [],
    password: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors for this field when user starts typing
    if (errors[name as keyof FormErrors].length > 0) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const simulateSignUpRequest = async (data: FormData): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Form data submitted:", data);
        
        const mockErrors: FormErrors = {
          nickname: [],
          email: [],
          password: [],
        };

        // Simulate validation errors
        if (data.nickname.toLowerCase() === "admin" || data.nickname.toLowerCase() === "user") {
          mockErrors.nickname.push("nickname already in use");
        }

        if (!data.email.includes("@") || !data.email.includes(".")) {
          mockErrors.email.push("email has wrong format");
        }

        if (data.password.length < 8) {
          mockErrors.password.push("password is too short");
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
          mockErrors.password.push("password is too weak");
        }

        const hasErrors = Object.values(mockErrors).some(fieldErrors => fieldErrors.length > 0);
        
        if (hasErrors) {
          reject(mockErrors);
        } else {
          resolve();
        }
      }, 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ nickname: [], email: [], password: [] });

    try {
      await simulateSignUpRequest(formData);
      alert("Sign up successful!");
      setFormData({ nickname: "", email: "", password: "" });
    } catch (error) {
      setErrors(error as FormErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 bg-white p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      
      {/* Nickname Field */}
      <div className="mb-4">
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
          Nickname
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.nickname.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            {errors.nickname.join(", ")}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.email.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            {errors.email.join(", ")}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        {errors.password.length > 0 && (
          <p className="text-red-500 text-sm mt-1">
            {errors.password.join(", ")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isSubmitting ? "Signing Up..." : "Sign Up"}
      </button>
    </form>
  );
};

export default NewPageSignUp;
