# 🚀 StackIt – A Minimal Q&A Forum Platform

StackIt is a lightweight question-and-answer platform built during the Odoo Hackathon.  
It supports collaborative learning and structured knowledge sharing within a community, focusing on simplicity and an intuitive user experience.

---

## 🌟 Key Features

### 🔥 Core Functionality
- **Ask Questions:**  
  Users can submit questions with a short title, rich-text description, and multiple tags (e.g., React, JWT).
- **Rich Text Editor:**  
  Supports bold, italic, strikethrough, lists, emojis, hyperlinks, image uploads, and text alignment.
- **Answer Questions:**  
  Logged-in users can post well-formatted answers.
- **Voting & Accepted Answers:**  
  Users upvote/downvote answers, and question owners can mark one answer as accepted.
- **Tagging:**  
  Ensures all questions are categorized with relevant tags.

### 🔔 Notification System
- Bell icon in the navbar shows count of unread notifications.
- Users get notified when:
  - Someone answers their question.
  - Someone comments on their answer.
  - Someone mentions them via `@username`.

---

## 👥 User Roles
| Role   | Permissions                                  |
|--------|----------------------------------------------|
| Guest  | View all questions and answers              |
| User   | Register, log in, post questions/answers, vote |
| Admin  | Moderate content                            |

---

## 🚀 Tech Stack
- **Backend:** Odoo (Python)
- **Frontend:** Odoo views/widgets + rich text editor components
- **Database:** Odoo ORM (PostgreSQL under the hood)

---

