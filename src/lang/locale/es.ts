// Español

export default {
  "commands": {
    "lint-file": {
      "name": "Analizar este archivo",
      "error-message": "Error Analizando un Archivooccurió en el Archivo"
    },
    "lint-file-unless-ignored": {
      "name": "Analizar este archivo si no es ignorado"
    },
    "lint-all-files": {
      "name": "Analizar todos los archivos en la cripta",
      "error-message": "Error Analizando Todos los Archivos en Archivo",
      "success-message": "Analizó todos los archivos",
      "errors-message-singular": "Analizó todos los archivos y un error ocurrió.",
      "errors-message-plural": "Analizó todos los archivos y {NUM} errores ocurrieron",
      "start-message": "Esto editará todos de sus archivos y es possible que introduzca errores",
      "submit-button-text": "Analizar Todo",
      "submit-button-notice-text": "Analizando todos los archivos..."
    },
    "lint-all-files-in-folder": {
      "name": "Analizar todos los archivos en esta carpeta",
      "start-message": "Esto editará todos de sus archivos en {FOLDER_NAME} incluyendo los archivos que existen en las subcarpetas y es possible que introduzca errores.",
      "submit-button-text": "Analizar Todos los Archivos en {FOLDER_NAME}",
      "submit-button-notice-text": "Analizando todos los archivos en {FOLDER_NAME}...",
      "error-message": "Error Analizando Todos los Archivos en Carpeta en Archivo",
      "success-message": "Analizó los {NUM} archivos en {FOLDER_NAME}.",
      "message-singular": "Analizó los {NUM} archivos en {FOLDER_NAME} y un error ocurrió.",
      "message-plural": "Analizó los {FILE_COUNT} archivos en {FOLDER_NAME} y {ERROR_COUNT} errores ocurrieron."
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
    "pre-rules": "Las reglas antes de las reglas normales",
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
    "invalid-date-format-error": "No se pudo analizar ni identificar el formato de la fech de creación '{DATE}' entonces la fecha de creación se dejó sola en '{FILE_NAME}'",
    "invalid-delimiter-error-message": "El delimitador solo puede ser de un solo carácter",
    "missing-footnote-error-message": "La nota al pie '{FOOTNOTE}' no tiene ninguna referencia de nota al pie correspondiente antes del contenido de la nota al pie y no se puede procesar. Asegúrese de que todas las notas a pie de página tengan una referencia correspondiente antes del contenido de la nota al pie de página.",
    "too-many-footnotes-error-message": "La tecla de nota al pie '{FOOTNOTE_KEY}' tiene más de 1 nota al pie que hace referencia a ella. Actualice las notas al pie para que solo haya una nota al pie por clave de nota al pie.",
    "wrapper-yaml-error": "hubo un error en el yaml: {ERROR_MESSAGE}",
    "wrapper-unknown-error": "huno un error desconocido: {ERROR_MESSAGE}"
  },
  "notice-text": {
    "empty-clipboard": "No hay contenido del portapapeles.",
    "characters-added": "Caracteres añadidos",
    "characters-removed": "Caracteres eliminados"
  },
  "linter-title": "Linter",
  "empty-search-results-text": "No hay configuración que coincida con la búsqueda",
  "warning-text": "Advertencia",
  "file-backup-text": "Asegúrese de haber realizado una copia de seguridad de sus archivos.",
  "tabs": {
    "names": {
      "general": "Ajustes generales",
      "custom": "Ajustes personalizados",
      "yaml": "Ajustes de YAML",
      "heading": "Ajustes del encabezado",
      "content": "Ajustes de notas al pie",
      "footnote": "Ajustes del contenido",
      "spacing": "Ajustes del espacio en blanco",
      "paste": "Ajustes de pegar",
      "debug": "Ajustes de depurar"
    },
    "default-search-bar-text": "Buscar en todos los ajustes",
    "general": {
      "lint-on-save": {
        "name": "Analizar en guardar"
      }
    }
  }
};