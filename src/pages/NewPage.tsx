import React, { useState } from "react";

// TODO: register form
// sing up
// 3 fields: nickname, email, password
// Each field need to have an label and input input should be under label
// And submit should be blue.
// on submit, form is submitted, we should simulate a sign up with email and password
// request  and response/ (console.log form data)
// on response we should reject and payload should have errors
// ✅ ERRORS: nickname already in use, email has wrong format, password: !is too short, and is too weak.
// ✅ on each field we should show error message if there is an error.
// with red color and each message should be separated with a comma.

const NewPage: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setErrorError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Set<string>>(new Set());

  const mockRequest = async (email: string, password: string) => {
    if (email && !email.includes("@")) {
      throw new Error("Invalid email");
    }
  };

  const handleSubmit = (e: any) => {
    // TODO: read from formdata

    e.preventDefault();

    if (nickname && nickname === "test1") {
      setNicknameError("Already in use");
    } else {
      setNicknameError("");
    }

    if (email && !email.includes("@")) {
      setErrorError("Email wrong format");
    } else {
      setErrorError("");
    }

    if (password) {
      console.log("input password", password);
      if (password.length < 5) {
        setPasswordErrors(passwordErrors.add("Too short"));
      } else {
        if (passwordErrors.has("Too short")) {
          passwordErrors.delete("Too short");
        }
      }

      if (!password.includes("@")) {
        setPasswordErrors(
          // passwordErrors.length ? [...passwordErrors, "Too weak"] : ["Too weak"]
          passwordErrors.add("Too weak")
        );
      } else {
        if (passwordErrors.has("Too weak")) {
          passwordErrors.delete("Too weak");
        }
      }
    } else {
      setPasswordErrors(new Set());
    }

    if (emailError || passwordErrors.size !== 0) {
      mockRequest(email, password)
        .then((r) => {
          alert("All good");
          console.log(r);
        })
        .catch((error) => {
          console.error("error inside", error);

          setErrorError("Email wrong format");
        });
    }

    if (email && password && !emailError && passwordErrors.size === 0) {
      // todo request:
      console.log("request details: ", { email, password });
    }
  };

  return (
    <div className="flex flex-col">
      <form id="register-form" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          Nickname
          <div className="flex flex-col gap-4">
            <input
              id="nickname"
              type="input"
              onChange={(e) => setNickname(e.target.value)}
              value={nickname}
            />

            {nicknameError && <span style={{color: "red"}} id="nickname">Input new nickname</span>}
          </div>
        </div>
        <br />
        <div className="flex gap-4">
          Email
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            id="email"
          />
          {emailError && <label id="email"> {emailError} </label>}
        </div>
        <br />
        <div className="flex gap-4">
          Password:
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {passwordErrors &&
            // passwordErrors.values().toArray().join(', ')}
            new Array(...passwordErrors).join(", ")}
          <br />
        </div>
        <br />
        <br />
        <button style={{ color: "blue" }}>Sign UP</button>
      </form>
    </div>
  );
};

export default NewPage;
