<p align="center">
  <img src="https://github.com/Runa8147/Hackathena_Readme_Template/blob/d0add823684f0ac28b76a99636c729f80b0ca8ff/hackathena_banner.png" alt="Hackathena '26 2.0" width="100%">
</p>

<h1 align="center">NETSHIELD</h1>

<p align="center">
  <strong>AI-powered independent security monitoring for detecting suspicious network activity and DDoS attacks at the domain level.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Hackathena-'26%202.0-black?style=for-the-badge" alt="Hackathena">
  <img src="https://img.shields.io/badge/Theme-AI%20Fraud%20Detection-red?style=for-the-badge" alt="Theme">
  <img src="https://img.shields.io/badge/Status-Prototype-white?style=for-the-badge&labelColor=black" alt="Status">
</p>

---

## 👥 Team

**Team Name:** `Belmont`

| Member | Role | Institution |
| ---------- | --------- | ----------- |
| STEFIN A R | Team Lead | MAHARAJAS TECHNOLOGICAL INSTITUTE, THRISSUR |
| JEWEL ABRAHAM BIJU | Member | MAHARAJAS TECHNOLOGICAL INSTITUTE, THRISSUR |
| AADI ROBIN JOSEPH | Member | MAHARAJAS TECHNOLOGICAL INSTITUTE, THRISSUR |
| LEWIN JOSHY | Member | MAHARAJAS TECHNOLOGICAL INSTITUTE, THRISSUR |

---

## 🎯 Problem Statement

The rapid evolution of artificial intelligence is changing the cybersecurity landscape. AI can assist attackers in generating, scaling, and adapting malicious activity, making suspicious network behavior increasingly difficult to identify using simple rule-based observation.

Hosting providers and server platforms already implement infrastructure-level security mechanisms. However, domain owners, especially small businesses and users without dedicated cybersecurity teams, may have limited visibility into what is happening specifically to their domain.

A website becoming slow or unavailable does not immediately tell the owner whether the cause is legitimate traffic, a technical problem, or a potential cyberattack.

NetShield addresses this visibility gap by providing an independent security monitoring and analysis layer that helps domain owners detect suspicious network behavior, understand the associated risk, and take informed action.

### The Core Problem

- AI-assisted cyberattacks are becoming increasingly scalable and adaptable.
- DDoS and abnormal traffic can disrupt website availability.
- Domain owners may not have sufficient security visibility.
- Website anomalies can be difficult to distinguish from legitimate traffic or technical issues.
- Small organizations may not have dedicated cybersecurity teams.
- Detection without understandable alerts provides limited practical value.
- Users need security intelligence that helps them understand **what happened, why it matters, and what to investigate next**.

---

## 💡 Solution

# NetShield

**NetShield** is an independent domain-level security monitoring and detection solution designed to complement existing hosting and server security.

Instead of replacing the security mechanisms provided by hosting providers, NetShield adds an additional visibility and intelligence layer for the domain owner.

The current prototype accepts **PCAP network traffic data**, extracts relevant network features, and analyzes the traffic using the **LUCID deep-learning model** to detect DDoS-related activity.

NetShield also incorporates distributed monitoring, where multiple monitoring points observe domain behavior. These observations can be correlated with AI-based detection results to identify suspicious activity and generate a security alert.

### Key Features

- 🔴 **AI-Based DDoS Detection**  
  Uses the LUCID deep-learning model to analyze network traffic and identify DDoS-related activity.

- ⚪ **PCAP-Based Network Analysis**  
  Allows network traffic captured in PCAP format to be analyzed for suspicious behavior.

- ⚫ **Distributed Monitoring**  
  Uses multiple monitoring points to observe domain behavior independently.

- ⚪ **Risk-Based Alerts**  
  Converts detected suspicious activity into understandable security alerts and risk information.

- ⚫ **Actionable Security Reports**  
  Provides evidence and information that can help the domain owner investigate and respond.

- 🔴 **Independent Security Visibility**  
  Works alongside existing hosting and infrastructure security instead of attempting to replace it.

### Core Concept

> **Your hosting provider protects the infrastructure. NetShield helps you understand what is happening to your domain.**

---

## 🔄 How It Works

```text
                    DOMAIN
                       │
                       ▼
              DOMAIN MONITORING
                       │
                       ▼
             PCAP & DATA COLLECTION
                       │
                       ▼
          FEATURE EXTRACTION & LUCID
                       │
                       ▼
                    DETECTION 
                       │
                       ▼
            RISK ASSESSMENT & ALERT
                       │
                       ▼
                 USER ACTION