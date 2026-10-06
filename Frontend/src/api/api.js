const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadTrafficFile(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/api/analysis/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    let message = "Analysis request failed.";

    try {
      const errorData = await response.json();
      message = errorData.detail || message;
    } catch {
      // Keep default error message
    }

    throw new Error(message);
  }

  return response.json();
}