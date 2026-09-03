/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    const usuario = sessionStorage.getItem("usuarioLogueado");
    if (!usuario) {
      window.location.replace("/login.html");
    } else {
      window.location.replace("/index.html");
    }
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#0f172a",
      color: "#ffffff",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <div style={{ textAlign: "center" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>CORSSEN LOGÍSTICA</h2>
        <p style={{ fontSize: "14px", color: "#94a3b8" }}>Cargando Sistema de Control de Flota...</p>
      </div>
    </div>
  );
}

