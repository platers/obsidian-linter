// Español

export default {
  "commands": {
    "lint-file": {
      "name": "Analizar el archivo actual",
      "error-message": "Se ha producido un error analizando un archivo en el archivo"
    },
    "lint-file-unless-ignored": {
      "name": "Lint el archivo actual a menos que se omita"
    },
    "lint-all-files": {
      "name": "Lint todos los archivos del almacén",
      "error-message": "Se ha producido un error analizando todos los archivos en el archivo",
      "success-message": "Analizó todos los archivos",
      "errors-message-singular": "Analizó Linted todos los archivos y hubo 1 error.",
      "errors-message-plural": "Analizó todos los archivos y hubieron {NUM} errores",
      "start-message": "Esto editará todos sus archivos y puede introducir errores",
      "submit-button-text": "Analizar todo",
      "submit-button-notice-text": "Analizando todos los archivos..."
    },
    "lint-all-files-in-folder": {
      "name": "Analizar todos los archivos en la carpeta actual",
      "start-message": "Esto editará todos sus archivos en {FOLDER_NAME} incluyendo los archivos que existen en las subcarpetas y puede introducir errores.",
      "submit-button-text": "Analizar todos los archivos en {FOLDER_NAME}",
      "submit-button-notice-text": "Analizando todos los archivos en {FOLDER_NAME}...",
      "error-message": "Se ha producido un error analizando todos los archivos en la carpeta en archivo",
      "success-message": "Analizó todos los {NUM} archivos en {FOLDER_NAME}.",
      "message-singular": "Analizó todos los {NUM} archivos en {FOLDER_NAME} y hubo un error.",
      "message-plural": "Analizó los {FILE_COUNT} archivos en {FOLDER_NAME} y hubieron {ERROR_COUNT} errores."
    },
    "paste-as-plain-text": {
      "name": "Pegar como texto sin formato y sin modificaciones"
    },
    "lint-file-pop-up-menu-text": {
      "name": "Analizar el archivo"
    },
    "lint-folder-pop-up-menu-text": {
      "name": "Analizar la carpeta"
    }
  },
  "logs": {
    "plugin-load": "Cargando el programa adicional",
    "plugin-unload": "Descargando el programa adicional",
    "folder-lint": "Analizando la carpeta ",
    "linter-run": "Usando linter",
    "paste-link-warning": "abortó lint de pagar porque el contento del portapapeles es un enlace y no lo hizo para evitar conflictos con otros programas adicionales que modifican lo que hace el pegar.",
    "see-console": "Consulte la consola para obtener más detalles.",
    "unknown-error": "Se ha producido un error desconocido durante el linting.",
    "moment-locale-not-found": "Intentando cambiar la zona de Moment.js a {MOMENT_LOCALE}, el resulto fue {CURRENT_LOCALE}",
    "pre-rules": "las reglas antes de las reglas normales",
    "post-rules": "las reglas después de las reglas normales",
    "rule-running": "usando las reglas",
    "custom-regex": "las reglas regex personalizadas",
    "running-custom-regex": "Usando regex personalizada",
    "running-custom-lint-command": "Usando comandos de lint personalizados",
    "custom-lint-duplicate-warning": "No se puede usar el mismo comando (\"{COMMAND_NAME}\") dos veces como un comando de lint.",
    "custom-lint-error-message": "El commando de lint personalizado",
    "disabled-text": "es inhabilitado",
    "run-rule-text": "Usando",
    "timing-key-not-found": "clave de ritmo '{TIMING_KEY}' no ya existe en la lista de claves de ritmo y fue ignorado por eso",
    "milliseconds-abbreviation": "ms",
    "invalid-date-format-error": "No se pudo analizar ni identificar el formato de la fech de creación '{DATE}' entonces la fecha de creación se dejó sola en '{FILE_NAME}'"
  }
};
