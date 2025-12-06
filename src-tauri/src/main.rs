// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::process::Command;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
struct PackageInstallResult {
    success: bool,
    message: String,
}

#[tauri::command]
async fn install_npm_package(package_name: String, app_handle: tauri::AppHandle) -> Result<PackageInstallResult, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let node_modules_dir = app_dir.join("playground");
    
    // Create directory if it doesn't exist
    if !node_modules_dir.exists() {
        std::fs::create_dir_all(&node_modules_dir)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
        
        // Initialize package.json if it doesn't exist
        let package_json = node_modules_dir.join("package.json");
        if !package_json.exists() {
            let init_json = r#"{"name":"sketchjs-playground","version":"1.0.0","private":true}"#;
            std::fs::write(package_json, init_json)
                .map_err(|e| format!("Failed to create package.json: {}", e))?;
        }
    }
    
    // Run npm install
    let output = Command::new("npm")
        .args(&["install", &package_name])
        .current_dir(&node_modules_dir)
        .output()
        .map_err(|e| format!("Failed to execute npm install: {}", e))?;
    
    if output.status.success() {
        Ok(PackageInstallResult {
            success: true,
            message: format!("Successfully installed {}", package_name),
        })
    } else {
        let error_message = String::from_utf8_lossy(&output.stderr);
        Ok(PackageInstallResult {
            success: false,
            message: format!("Failed to install {}: {}", package_name, error_message),
        })
    }
}

#[tauri::command]
async fn get_installed_packages(app_handle: tauri::AppHandle) -> Result<Vec<String>, String> {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {}", e))?;
    
    let package_json = app_dir.join("playground").join("package.json");
    
    if !package_json.exists() {
        return Ok(vec![]);
    }
    
    let content = std::fs::read_to_string(package_json)
        .map_err(|e| format!("Failed to read package.json: {}", e))?;
    
    let json: serde_json::Value = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse package.json: {}", e))?;
    
    let mut packages = vec![];
    
    if let Some(deps) = json.get("dependencies").and_then(|d| d.as_object()) {
        for (name, _) in deps {
            packages.push(name.clone());
        }
    }
    
    Ok(packages)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            install_npm_package,
            get_installed_packages
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

