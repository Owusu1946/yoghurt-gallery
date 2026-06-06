"use client";

import { authFieldClass, authLabelClass } from "@/components/auth/form-styles";
import { toast } from "@/lib/toast";
import { useState } from "react";

const subjects = [
  "General enquiry",
  "Custom tee / print order",
  "Bulk order quote",
  "Order support",
  "Partnership",
] as const;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState<string>(subjects[0]);
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.warning("Name required", {
        description: "Enter your name so we know who to reply to.",
      });
      return;
    }
    if (!message.trim()) {
      toast.warning("Message required", {
        description: "Tell us how we can help.",
      });
      return;
    }
    toast.success("Message sent", {
      description: `Thanks, ${name.trim()}. We'll get back to you soon.`,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-brand/15 bg-brand/[0.03] p-6 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-brand">
          Message sent
        </p>
        <p className="mt-3 text-sm leading-relaxed text-brand/70">
          Thanks, {name.trim()}. We will get back to you on{" "}
          {phone.trim() || email.trim() || "the details you provided"} as soon
          as we can.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-brand underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className={authLabelClass}>
          Name
        </label>
        <input
          id="contact-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={authFieldClass}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={authLabelClass}>
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={authFieldClass}
            placeholder="024 000 0000"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={authLabelClass}>
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authFieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={authLabelClass}>
          Subject
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={authFieldClass}
        >
          {subjects.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={authLabelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={authFieldClass}
          placeholder="Tell us about your order, design, or question…"
        />
      </div>

      <button
        type="submit"
        className="w-full border border-brand bg-brand px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-white transition-opacity hover:opacity-90 sm:w-auto"
      >
        Send message
      </button>
      <p className="text-xs text-brand/45">
        Messages are received in-app for now. We will call or email you back.
      </p>
    </form>
  );
}
