// Español

export default {
  'commands': {
    'lint-file': {
      'name': 'Analizar este archivo',
      'error-message': 'Error Analizando un Archivooccurió en el Archivo',
    },
    'lint-file-unless-ignored': {
      'name': 'Analizar este archivo si no es ignorado',
    },
    'lint-all-files': {
      'name': 'Analizar todos los archivos en la bóveda',
      'error-message': 'Error Analizando Todos los Archivos en Archivo',
      'success-message': 'Analizó todos los archivos',
      'errors-message-singular': 'Analizó todos los archivos y un error ocurrió.',
      'errors-message-plural': 'Analizó todos los archivos y {NUM} errores ocurrieron',
      'start-message': 'Esto editará todos de sus archivos y es possible que introduzca errores',
      'submit-button-text': 'Analizar Todo',
      'submit-button-notice-text': 'Analizando todos los archivos...',
    },
    'lint-all-files-in-folder': {
      'name': 'Analizar todos los archivos en esta carpeta',
      'start-message': 'Esto editará todos de sus archivos en {FOLDER_NAME} incluyendo los archivos que existen en las subcarpetas y es possible que introduzca errores.',
      'submit-button-text': 'Analizar Todos los Archivos en {FOLDER_NAME}',
      'submit-button-notice-text': 'Analizando todos los archivos en {FOLDER_NAME}...',
      'error-message': 'Error Analizando Todos los Archivos en Carpeta en Archivo',
      'success-message': 'Analizó los {NUM} archivos en {FOLDER_NAME}.',
      'message-singular': 'Analizó los {NUM} archivos en {FOLDER_NAME} y un error ocurrió.',
      'message-plural': 'Analizó los {FILE_COUNT} archivos en {FOLDER_NAME} y {ERROR_COUNT} errores ocurrieron.',
    },
    'paste-as-plain-text': {
      'name': 'Pegar como texto sin formato y sin modificaciones',
    },
    'lint-file-pop-up-menu-text': {
      'name': 'Analizar el archivo',
    },
    'lint-folder-pop-up-menu-text': {
      'name': 'Analizar la carpeta',
    },
  },
  'logs': {
    'plugin-load': 'Cargando el programa adicional',
    'plugin-unload': 'Descargando el programa adicional',
    'folder-lint': 'Analizando la carpeta ',
    'linter-run': 'Usando linter',
    'paste-link-warning': 'abortó lint de pagar porque el contento del portapapeles es un enlace y no lo hizo para evitar conflictos con otros programas adicionales que modifican lo que hace el pegar.',
    'see-console': 'Consulte la consola para obtener más detalles.',
    'unknown-error': 'Se ha producido un error desconocido durante el linting.',
    'moment-locale-not-found': 'Intentando cambiar la zona de Moment.js a {MOMENT_LOCALE}, el resulto fue {CURRENT_LOCALE}',
    'file-change-lint-message-start': 'Analizó',
    'pre-rules': 'Las reglas antes de las reglas normales',
    'post-rules': 'las reglas después de las reglas normales',
    'rule-running': 'usando las reglas',
    'custom-regex': 'las reglas regex personalizadas',
    'running-custom-regex': 'Usando regex personalizada',
    'running-custom-lint-command': 'Usando comandos de lint personalizados',
    'custom-lint-duplicate-warning': 'No se puede usar el mismo comando ("{COMMAND_NAME}") dos veces como un comando de lint.',
    'custom-lint-error-message': 'El commando de lint personalizado',
    'disabled-text': 'es inhabilitado',
    'run-rule-text': 'Usando',
    'timing-key-not-found': 'clave de ritmo \'{TIMING_KEY}\' no ya existe en la lista de claves de ritmo y fue ignorado por eso',
    'milliseconds-abbreviation': 'ms',
    'invalid-date-format-error': 'No se pudo analizar ni identificar el formato de la fech de creación `{DATE}` entonces la fecha de creación se dejó sola en `{FILE_NAME}`',
    'invalid-delimiter-error-message': 'El delimitador solo puede ser de un solo carácter',
    'missing-footnote-error-message': 'La nota al pie `{FOOTNOTE}` no tiene ninguna referencia de nota al pie correspondiente antes del contenido de la nota al pie y no se puede procesar. Asegúrese de que todas las notas a pie de página tengan una referencia correspondiente antes del contenido de la nota al pie de página.',
    'too-many-footnotes-error-message': `La clave de nota al pie '{FOOTNOTE_KEY}' tiene más de 1 nota al pie que hace referencia a ella. Actualice las notas al pie para que solo haya una nota al pie por clave de nota al pie.`,
    'wrapper-yaml-error': 'hubo un error en el YAML: {ERROR_MESSAGE}',
    'wrapper-unknown-error': 'huno un error desconocido: {ERROR_MESSAGE}',
  },
  'notice-text': {
    'empty-clipboard': 'No hay contenido del portapapeles.',
    'characters-added': 'Caracteres añadidos',
    'characters-removed': 'Caracteres eliminados',
  },
  'all-rules-option': 'Todo',
  'linter-title': 'Linter',
  'empty-search-results-text': 'No hay configuración que coincida con la búsqueda',
  'warning-text': 'Advertencia',
  'file-backup-text': 'Asegúrese de haber realizado una copia de seguridad de sus archivos.',
  'copy-aria-label': 'Copiar',
  'tabs': {
    'names': {
      'general': 'General',
      'custom': 'Personalizado',
      'yaml': 'YAML',
      'heading': 'Encabezado',
      'content': 'Contenido',
      'footnote': 'Notas al pie',
      'spacing': 'Espacio en blanco',
      'paste': 'Pegar',
      'debug': 'Depurar',
    },
    'default-search-bar-text': 'Buscar en todos los ajustes',
    'general': {
      'lint-on-save': {
        'name': 'Analizar en guardar',
        'description': 'Analizar el archivo en el guardado manual (cuando se presiona `Ctrl + S` o cuando se ejecuta `:w` mientras se usan combinaciones de claves de vim)',
      },
      'display-message': {
        'name': 'Mostrar mensaje en analizar',
        'description': 'Mostrar el número de caracteres modificados después de analizar',
      },
      'suppress-message-when-no-change': {
        'name': 'Suprimir mensaje cuando no hay cambios',
        'description': 'Si está habilitado, no se mostrará ningún mensaje cuando no ocurran cambios reales.',
      },
      'folders-to-ignore': {
        'name': 'Carpetas para omitir',
        'description': 'Carpetas que se deben omitir al analizar todos los archivos o al guardar en línea.',
        'folder-search-placeholder-text': 'El nombre de la carpeta',
        'add-input-button-text': 'Agregar otra carpeta para ignorar',
        'delete-tooltip': 'Borrar',
      },
      'lint-on-file-change': {
        'name': 'Analizar archivo en cambiar',
        'description': 'Cuando se cierra un archivo o se cambia a un nuevo archivo, el archivo anterior se analiza.',
      },
      'display-lint-on-file-change-message': {
        'name': 'Mostrar mensaje en cambiar el archivo',
        'description': 'Muestra un mensaje cuando se produce `Analizar archivo en cambiar`',
      },
      'override-locale': {
        'name': 'Anular configuración regional',
        'description': 'Establezca esta opción si desea utilizar una configuración regional diferente de la predeterminada',
      },
      'same-as-system-locale': 'Igual que el sistema ({SYS_LOCALE})',
      'yaml-aliases-section-style': {
        'name': 'Estilo de sección de alias de YAML',
        'description': 'El estilo de la sección de alias de YAML',
      },
      'yaml-tags-section-style': {
        'name': 'Estilo de sección de etiquetas de YAML',
        'description': 'El estilo de la sección de etiquetas de YAML',
      },
      'default-escape-character': {
        'name': 'Carácter de escape predeterminado',
        'description': 'El carácter predeterminado que se va a usar para escapar de los valores YAML cuando no hay comillas simples y comillas dobles.',
      },
      'remove-unnecessary-escape-chars-in-multi-line-arrays': {
        'name': 'Eliminación de caracteres de escape innecesarios cuando está en formato de matriz multilínea',
        'description': 'Los caracteres de escape para matrices de YAML multilínea no necesitan el mismo escape que las matrices de una sola línea, por lo que cuando están en formato multilínea, elimine los escapes adicionales que no son necesarios',
      },
      'number-of-dollar-signs-to-indicate-math-block': {
        'name': 'Número de signos de dólar para indicar el bloque matemático',
        'description': 'La cantidad de signos de dólar para considerar el contenido matemático como un bloque matemático en lugar de matemáticas en línea',
      },
    },
    'debug': {
      'log-level': {
        'name': 'Nivel de registro',
        'description': 'Los tipos de registros que el servicio permitirá registrar. El valor predeterminado es error.',
      },
      'linter-config': {
        'name': 'Configuración de Linter',
        'description': 'El contenido del archivo data.json para Linter a partir de la carga de la página de configuración',
      },
      'log-collection': {
        'name': 'Recopilar registros al activar y desactivar el archivo actual',
        'description': 'Continúa y recopila registros cuando `Analizar en guardar` y analizar el archivo actual. Estos registros pueden ser útiles para depurar y crear informes de errores.',
      },
      'linter-logs': {
        'name': 'Registros de Linter',
        'description': 'Los registros del último `Analizar en guardar` o del último archivo actual de analizar se ejecutan si están habilitados.',
      },
    },
  },
  'options': {
    'custom-command': {
      'name': 'Comandos personalizados',
      'description': 'Los comandos personalizados son comandos de Obsidian que se ejecutan después de que Linter termina de ejecutar sus reglas regulares. Esto significa que no se ejecutan antes de que se ejecute la lógica de marca de tiempo YAML, por lo que pueden hacer que la marca de tiempo de YAML se active en la siguiente ejecución del Linter. Solo puede seleccionar un comando de Obsidian una vez.',
      'warning': 'Al seleccionar una opción, asegúrese de seleccionar la opción usando el ratón o presionando la clave Intro. Es posible que otros métodos de selección no funcionen y solo se guardarán las selecciones de un comando de Obsidian real o una cadena vacía.',
      'add-input-button-text': 'Agregar nuevo comando',
      'command-search-placeholder-text': 'Comando de Obsidian',
      'move-up-tooltip': 'Desplazar hacia arriba',
      'move-down-tooltip': 'Desplazar hacia abajo',
      'delete-tooltip': 'Borrar',
    },
    'custom-replace': {
      'name': 'Reemplazo regex personalizado',
      'description': 'El reemplazo de regex personalizado se puede usar para reemplazar cualquier cosa que coincida con el valor de búsqueda de regex con el valor de reemplazo. Los valores de reemplazo y búsqueda deberán ser valores regex válidos.',
      'warning': 'Use esto con precaución si no conoce regex. Además, asegúrese de no usar lookbehinds en su regex en dispositivos móviles iOS, ya que eso hará que falle analizar ya que no es compatible con esa plataforma.',
      'add-input-button-text': 'Agregar nuevo reemplazo de regex',
      'regex-to-find-placeholder-text': 'Regex para encontrar',
      'flags-placeholder-text': 'Marcas',
      'regex-to-replace-placeholder-text': 'Regex para reemplazar',
      'label-placeholder-text': 'etiqueta',
      'move-up-tooltip': 'Desplazar hacia arriba',
      'move-down-tooltip': 'Desplazar hacia abajo',
      'delete-tooltip': 'Borrar',
    },
  },
  'rules': {
    'auto-correct-common-misspellings': {
      'name': 'Corrección automática de errores ortográficos comunes',
      'description': 'Utiliza un diccionario de errores ortográficos comunes para convertirlos automáticamente a su ortografía correcta. Consulte <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">mapa de autocorrección</a> para obtener la lista completa de palabras corregidas automáticamente. <b>Nota: esta lista puede funcionar en texto de varios idiomas, pero esta lista es la misma sin importar qué idioma esté en uso actualmente.</b>',
      'ignore-words': {
        'name': 'Ignorar palabras',
        'description': 'Una lista separada por comas de palabras en minúsculas para ignorar al corregir automáticamente',
      },
    },
    'add-blockquote-indentation-on-paste': {
      'name': 'Agregar sangría de blockquote en pegar',
      'description': 'Agrega blockquotes a todas menos a la primera línea, cuando el cursor está en una línea blockquote/callout durante el pegado',
    },
    'blockquote-style': {
      'name': 'Estilo de cotización en bloque',
      'description': 'Se asegura de que el estilo de la cita en bloque sea consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'El estilo utilizado en los indicadores de cotización en bloque',
      },
    },
    'capitalize-headings': {
      'name': 'Poner mayúsculas en los encabezados',
      'description': 'Los encabezados deben estar formateados con mayúsculas',
      'style': {
        'name': 'Estilo',
        'description': 'El estilo de mayúsculas que se va a utilizar',
      },
      'ignore-case-words': {
        'name': 'Ignorar palabras en mayúsculas y minúsculas',
        'description': 'Solo aplique el estilo de mayúsculas y minúsculas a las palabras que estén todas en minúsculas',
      },
      'ignore-words': {
        'name': 'Ignorar palabras',
        'description': 'Una lista de palabras separadas por comas para ignorar al poner en mayúsculas',
      },
      'lowercase-words': {
        'name': 'Palabras en minúsculas',
        'description': 'Una lista de palabras separadas por comas para mantener minúsculas',
      },
    },
    'compact-yaml': {
      'name': 'YAML compacto',
      'description': 'Elimina las líneas en blanco iniciales y finales en la materia frontal de YAML.',
      'inner-new-lines': {
        'name': 'Nuevas líneas internas',
        'description': 'Quitar nuevas líneas que no estén al principio o al final del YAML',
      },
    },
    'consecutive-blank-lines': {
      'name': 'Líneas en blanco consecutivas',
      'description': 'Debe haber como máximo una línea en blanco consecutiva.',
    },
    'convert-bullet-list-markers': {
      'name': 'Convertir marcadores de lista de viñetas',
      'description': 'Convierte símbolos de marcador de lista de viñetas comunes en marcadores de lista de rebajas.',
    },
    'convert-spaces-to-tabs': {
      'name': 'Convertir espacios en pestañas',
      'description': 'Convierte los espacios iniciales en pestañas.',
      'tabsize': {
        'name': 'Tamaño de la pestaña',
        'description': 'Número de espacios que se convertirán en una pestaña',
      },
    },
    'emphasis-style': {
      'name': 'Estilo de énfasis',
      'description': 'Se asegura de que el estilo de énfasis sea consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'El estilo utilizado para denotar el contenido enfatizado',
      },
    },
    'empty-line-around-blockquotes': {
      'name': 'Línea vacía alrededor de blockquotes',
      'description': 'Asegura que haya una línea vacía alrededor de blockquotes a menos que inicien o finalicen un documento. **Tenga en cuenta que una línea vacía es un nivel menos de anidamiento para blockquotes o un carácter de nueva línea.**',
    },
    'empty-line-around-code-fences': {
      'name': 'Línea vacía alrededor de las vallas de código',
      'description': 'Garantiza que haya una línea vacía alrededor de las vallas de código a menos que inicien o finalicen un documento.',
    },
    'empty-line-around-math-blocks': {
      'name': 'Línea vacía alrededor de los bloques matemáticos',
      'description': 'Asegura que haya una línea vacía alrededor de los bloques matemáticos usando `Número de signos de dólar para indicar un bloque matemático` para determinar cuántos signos de dólar indica un bloque matemático para matemáticas de una sola línea.',
    },
    'empty-line-around-tables': {
      'name': 'Línea vacía alrededor de las tablas',
      'description': 'Asegura que haya una línea vacía alrededor de las tablas con sabor a github a menos que inicien o finalicen un documento.',
    },
    'escape-yaml-special-characters': {
      'name': 'Evitar los caracteres especiales de YAML',
      'description': 'Escapa dos puntos con un espacio después de ellos (:), comillas simples (\') y comillas dobles (") en YAML.',
      'try-to-escape-single-line-arrays': {
        'name': 'Intente escapar las matrices de una sola línea',
        'description': 'Intenta escapar de los valores de matriz suponiendo que una matriz comienza con "[", termina con "]" y tiene elementos que están delimitados por ",".',
      },
    },
    'file-name-heading': {
      'name': 'Encabezado de nombre de archivo',
      'description': 'Inserta el nombre de archivo como un encabezado H1 si no existe ningún encabezado H1.',
    },
    'footnote-after-punctuation': {
      'name': 'Nota al pie después de la puntuación',
      'description': 'Asegura que las referencias de notas al pie se coloquen después de la puntuación, no antes.',
    },
    'force-yaml-escape': {
      'name': 'Forzar escape de YAML',
      'description': 'Escapa los valores de las claves YAML especificadas.',
      'force-yaml-escape-keys': {
        'name': 'Forzar escape de YAML en las claves',
        'description': 'Utiliza el carácter de escape de YAML en las claves de YAML especificadas separadas por un nuevo carácter de línea si aún no está escapado. No lo use en matrices de YAML.',
      },
    },
    'format-tags-in-yaml': {
      'name': 'Dar formato a las etiquetas de formato en YAML',
      'description': 'Elimine los hashtags de las etiquetas en el frontmatter del YAML, ya que hacen que las etiquetas no sean válidas.',
    },
    'format-yaml-array': {
      'name': 'Dar formato a las matrices de YAML',
      'description': 'Permite el formato de matrices regulares de YAML como multilínea o de una sola línea y las `etiquetas` y `alias` pueden tener algunos formatos específicos de YAML de Obsidian. Tenga en cuenta que una sola cadena a una sola línea pasa de una sola entrada de cadena a una matriz de una sola línea si hay más de 1 entrada presente. Lo mismo es cierto para una sola cadena a multilínea, excepto que se convierte en una matriz multilínea.',
      'alias-key': {
        'name': 'Dar formato a la sección de alias de YAML',
        'description': 'Activa el formato para la sección de alias YAML. No debe habilitar esta opción junto con la regla `Alias de título YAML`, ya que es posible que no funcionen bien juntos o que tengan diferentes estilos de formato seleccionados que causen resultados inesperados.',
      },
      'tag-key': {
        'name': 'Dar formato a la sección de etiquetas de YAML',
        'description': 'Activa el formato para la sección de etiquetas de YAML.',
      },
      'default-array-style': {
        'name': 'Estilo de sección de matriz predeterminado de YAML',
        'description': 'El estilo de otras matrices de YAML que no son `etiquetas`, `alias` o en `Forzar valores de clave para que sean matrices de una sola línea` y `Forzar valores de clave para que sean matrices multilínea`',
      },
      'default-array-keys': {
        'name': 'Dar formato a las secciones de matrices de YAML',
        'description': 'Activa el formato para matrices normales de YAML',
      },
      'force-single-line-array-style': {
        'name': 'Forzar que los valores de clave sean matrices de una sola línea',
        'description': 'Fuerza la matriz de YAML para que las nuevas claves separadas por línea estén en formato de una sola línea (deje vacío para deshabilitar esta opción)',
      },
      'force-multi-line-array-style': {
        'name': 'Forzar que los valores de las claves sean matrices multilíneas',
        'description': 'Fuerza la matriz de YAML para que las nuevas claves separadas por línea estén en formato multilínea (deje vacía para deshabilitar esta opción)',
      },
    },
    'header-increment': {
      'name': 'Incremento de encabezado',
      'description': 'Los niveles de encabezado solo deben aumentar en un nivel a la vez',
      'start-at-h2': {
        'name': 'Iniciar el incremento de encabezado en el nivel de encabezado 2',
        'description': 'Hace que el nivel de encabezado 2 sea el nivel de título mínimo en un archivo para el incremento de encabezado y desplaza todos los encabezados en consecuencia para que se incrementen a partir de un encabezado de nivel 2.',
      },
    },
    'heading-blank-lines': {
      'name': 'Líneas en blanco de encabezado',
      'description': 'Todos los encabezados tienen una línea en blanco antes y después (excepto cuando el encabezado está al principio o al final del documento).',
      'bottom': {
        'name': 'Abajo',
        'description': 'Asegura una línea en blanco después de los encabezados',
      },
      'empty-line-after-yaml': {
        'name': 'Línea vacía entre el YAML y el encabezado',
        'description': 'Mantenga la línea vacía entre el frontmatter del YAML y el encabezado',
      },
    },
    'headings-start-line': {
      'name': 'Comenzar los encabezados al principio de la línea',
      'description': 'Los encabezados que no inician una línea tendrán su espacio en blanco anterior eliminado para asegurarse de que se reconozcan como encabezados.',
    },
    'insert-yaml-attributes': {
      'name': 'Insertar atributos de YAML',
      'description': 'Inserta los atributos especificados de YAML en el frontmatter del YAML. Coloque cada atributo en una sola línea.',
      'text-to-insert': {
        'name': 'Texto a insertar',
        'description': 'Texto para insertar en el frontmatter del YAML',
      },
    },
    'line-break-at-document-end': {
      'name': 'Salto de línea al final del documento',
      'description': 'Asegura que haya exactamente un salto de línea al final de un documento.',
    },
    'move-footnotes-to-the-bottom': {
      'name': 'Mover las notas al pie a la parte inferior',
      'description': 'Mueva todas las notas al pie de página a la parte inferior del documento.',
    },
    'move-math-block-indicators-to-their-own-line': {
      'name': 'Mover los indicadores de bloques matemáticos a su propia línea',
      'description': 'Mueva todos los indicadores de bloques matemáticos iniciales y finales a sus propias líneas usando `Número de signos de dólar para indicar un bloque matemático` para determinar cuántos signos de dólar indica un bloque matemático para matemáticas de una sola línea.',
    },
    'move-tags-to-yaml': {
      'name': 'Mover etiquetas a YAML',
      'description': 'Mueva todas las etiquetas al frontmatter del YAML del documento.',
      'how-to-handle-existing-tags': {
        'name': 'Operación de etiqueta corporal',
        'description': 'Lo qur se debe hacer con las etiquetas no ignoradas en el cuerpo del archivo una vez que se han movido al frontmatter',
      },
      'tags-to-ignore': {
        'name': 'Etiquetas para omitir',
        'description': 'Las etiquetas que no se moverán a la matriz de etiquetas ni se eliminarán del contenido del cuerpo si está habilitado `Eliminar el hashtag de las etiquetas en el cuerpo del contenido`. Cada etiqueta debe estar en una nueva línea y sin el `#`. **Asegúrese de no incluir el hashtag en el nombre de la etiqueta.**',
      },
    },
    'no-bare-urls': {
      'name': 'Sin URL desnuda',
      'description': 'Encierra las direcciones URL desnudas con corchetes angulares, excepto cuando están encerradas en marcas traseras, llaves cuadradas o comillas simples o dobles.',
      'no-bare-uris': {
        'name': 'Sin URI desnuda',
        'description': 'Encierra las direcciones URI desnudas con corchetes angulares, excepto cuando están encerradas en marcas traseras, llaves cuadradas o comillas simples o dobles.',
      },
    },
    'ordered-list-style': {
      'name': 'Estilo de lista ordenada',
      'description': 'Se asegura de que las listas ordenadas siguen el estilo especificado. Tenga en cuenta que 2 espacios o 1 tabulación se considera un nivel de sangría.',
      'number-style': {
        'name': 'Estilo numérico',
        'description': 'El estilo numérico utilizado en los indicadores de lista ordenada',
      },
      'list-end-style': {
        'name': 'Estilo final del indicador de lista ordenada',
        'description': 'El carácter final de un indicador de lista ordenada',
      },
    },
    'paragraph-blank-lines': {
      'name': 'Líneas en blanco del párrafo',
      'description': 'Todos los párrafos deben tener exactamente una línea en blanco antes y después.',
    },
    'prevent-double-checklist-indicator-on-paste': {
      'name': 'Evitar el indicador de doble lista de verificación en pegar',
      'description': 'Elimina el indicador de lista de verificación inicial del texto para pegar si la línea en la que se encuentra el cursor en el archivo tiene un indicador de lista de verificación',
    },
    'prevent-double-list-item-indicator-on-paste': {
      'name': 'Prevenir el indicador de elemento de lista doble al pegar',
      'description': 'Elimina el indicador de lista inicial del texto para pegar si la línea en la que se encuentra el cursor en el archivo tiene un indicador de lista',
    },
    'proper-ellipsis-on-paste': {
      'name': 'Puntos suspensivos adecuados al pegar',
      'description': 'Reemplaza tres puntos consecutivos por puntos suspensivos aunque tengan un espacio entre ellos en el texto a pegar',
    },
    'proper-ellipsis': {
      'name': 'Puntos suspensivos propios',
      'description': 'Reemplaza tres puntos consecutivos con puntos suspensivos.',
    },
    'quote-style': {
      'name': 'Estilo de cotización',
      'description': 'Actualiza las comillas en el contenido del cuerpo para que se actualicen a los estilos de comillas simples y dobles especificados.',
      'single-quote-enabled': {
        'name': 'Habilitar `Estilo de comillas simples`',
        'description': 'Especifica que se debe utilizar el estilo de comillas simples seleccionado.',
      },
      'single-quote-style': {
        'name': 'Estilo de comillas simples',
        'description': 'El estilo de las comillas simples a utilizar.',
      },
      'double-quote-enabled': {
        'name': 'Habilitar `Estilo de comillas dobles`',
        'description': 'Especifica que se debe utilizar el estilo de comillas dobles seleccionado.',
      },
      'double-quote-style': {
        'name': 'Estilo de comillas dobles',
        'description': 'El estilo de comillas dobles a utilizar.',
      },
    },
    're-index-footnotes': {
      'name': 'Volver a indexar notas al pie',
      'description': 'Vuelve a indexar las notas al pie de página y las notas al pie, según el orden de aparición (NOTA: esta regla *no* funciona si hay más de una nota al pie para una clave).',
    },
    'remove-consecutive-list-markers': {
      'name': 'Eliminar marcadores de lista consecutiva',
      'description': 'Elimina marcadores de lista consecutivos. Útil al copiar y pegar elementos de la lista.',
    },
    'remove-empty-lines-between-list-markers-and-checklists': {
      'name': 'Eliminar líneas vacías entre marcadores de lista y listas de verificación',
      'description': 'No debe haber líneas vacías entre los marcadores de lista y las listas de verificación.',
    },
    'remove-empty-list-markers': {
      'name': 'Eliminar marcadores de lista vacía',
      'description': 'Elimina marcadores de listas vacías, es decir, lista de elementos sin contenido.',
    },
    'remove-hyphenated-line-breaks': {
      'name': 'Eliminar saltos de línea con guión',
      'description': 'Elimina los saltos de línea con guión. Útil al pegar texto de libros de texto.',
    },
    'remove-hyphens-on-paste': {
      'name': 'Eliminar guiones al pegar',
      'description': 'Elimina guiones del texto al pegar',
    },
    'remove-leading-or-trailing-whitespace-on-paste': {
      'name': 'Eliminar espacios en blanco iniciales o finales al pegar',
      'description': 'Elimina cualquier espacio en blanco inicial que no sea una pestaña y todos los espacios en blanco finales para que el texto se pegue',
    },
    'remove-leftover-footnotes-from-quote-on-paste': {
      'name': 'Eliminar las notas al pie sobrantes de la cita al pegar',
      'description': 'Elimina las referencias de notas al pie sobrantes para que el texto se pegue',
    },
    'remove-link-spacing': {
      'name': 'Quitar el espacio entre enlaces',
      'description': 'Elimina el espacio alrededor del texto del enlace.',
    },
    'remove-multiple-blank-lines-on-paste': {
      'name': 'Eliminar varias líneas en blanco al pegar',
      'description': 'Condensa varias líneas en blanco en una línea en blanco para que el texto se pegue',
    },
    'remove-multiple-spaces': {
      'name': 'Quitar varios espacios',
      'description': 'Elimina dos o más espacios consecutivos. Ignora los espacios al principio y al final de la línea.',
    },
    'remove-space-around-characters': {
      'name': 'Quitar el espacio alrededor de los caracteres',
      'description': 'Garantiza que determinados caracteres no estén rodeados de espacios en blanco (ya sean espacios individuales o tabulaciones). Tenga en cuenta que esto puede causar problemas con el formato de descuento en algunos casos.',
      'include-fullwidth-forms': {
        'name': 'Incluir formularios de ancho completo',
        'description': 'Incluir <a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">bloque Unicode de formularios de ancho completo</a>',
      },
      'include-cjk-symbols-and-punctuation': {
        'name': 'Incluir símbolos de CJK y puntuación',
        'description': 'Incluir <a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">Bloque Unicode de símbolos y puntuación de CJK</a>',
      },
      'include-dashes': {
        'name': 'Incluir guiones',
        'description': 'Incluir guión corto (–) y guión largo (—)',
      },
      'other-symbols': {
        'name': 'Otros símbolos',
        'description': 'Otros símbolos para incluir',
      },
    },
    'remove-space-before-or-after-characters': {
      'name': 'Quitar el espacio antes o después de los caracteres',
      'description': 'Elimina el espacio antes de los caracteres especificados y después de los caracteres especificados. Tenga en cuenta que esto puede causar problemas con el formato de descuento en algunos casos.',
      'characters-to-remove-space-before': {
        'name': 'Eliminar espacio antes de los caracteres',
        'description': 'Elimina el espacio antes de los caracteres especificados. **Nota: el uso de `{` o `}` en la lista de caracteres afectará inesperadamente a los archivos, ya que se usa en la sintaxis de ignorar en segundo plano.**',
      },
      'characters-to-remove-space-after': {
        'name': 'Eliminar espacio después de los caracteres',
        'description': 'Elimina el espacio después de los caracteres especificados. **Nota: el uso de `{` o `}` en la lista de caracteres afectará inesperadamente a los archivos, ya que se usa en la sintaxis de ignorar en segundo plano.**',
      },
    },
    'remove-trailing-punctuation-in-heading': {
      'name': 'Eliminar la puntuación final en el encabezado',
      'description': 'Elimina la puntuación especificada al final de los encabezados, asegurándose de ignorar el punto y coma al final de <a href="https://es.wikipedia.org/wiki/Anexo:Referencias_a_entidades_de_caracteres_XML_y_HTML">referencias de entidades de HTML</a>.',
      'punctuation-to-remove': {
        'name': 'Puntuación final',
        'description': 'La puntuación final que se eliminará de los encabezados del archivo.',
      },
    },
    'remove-yaml-keys': {
      'name': 'Eliminar claves de YAML',
      'description': 'Elimina las claves especificadas de YAML',
      'yaml-keys-to-remove': {
        'name': 'Claves de YAML para eliminar',
        'description': 'Las claves de YAML para eliminar del frontmatter del YAML con o sin dos puntos',
      },
    },
    'space-after-list-markers': {
      'name': 'Espacio después de los marcadores de lista',
      'description': 'Debe haber un solo espacio después de los marcadores de lista y las casillas de verificación.',
    },
    'space-between-chinese-japanese-or-korean-and-english-or-numbers': {
      'name': 'Espacio entre chino japonés o coreano e inglés o números',
      'description': 'Garantiza que el chino, el japonés o el coreano y el inglés o los números estén separados por un solo espacio. Sigue estas <a href="https://github.com/sparanoid/chinese-copywriting-guidelines">directrices</a>',
    },
    'strong-style': {
      'name': 'Estilo fuerte',
      'description': 'Se asegura de que el estilo fuerte sea consistente.',
      'style': {
        'name': 'Estilo',
        'description': 'El estilo utilizado para denotar contenido fuerte/en negrita',
      },
    },
    'trailing-spaces': {
      'name': 'Espacios finales',
      'description': 'Elimina espacios adicionales después de cada línea.',
      'two-space-line-break': {
        'name': 'Salto de línea de dos espacios',
        'description': 'Ignore dos espacios seguidos de un salto de línea ("Regla de dos espacios").',
      },
    },
    'two-spaces-between-lines-with-content': {
      'name': 'Dos espacios entre líneas con contenido',
      'description': 'Se asegura de que el salto de línea especificado se agregue al final de las líneas y el contenido continúe en la línea siguiente para párrafos, citas en bloque y elementos de lista.',
      'line-break-indicator': {
        'name': 'Indicador de salto de línea',
        'description': 'El indicador de salto de línea a utilizar.',
      },
    },
    'unordered-list-style': {
      'name': 'Estilo de lista desordenada',
      'description': 'Se asegura de que las listas desordenadas sigan el estilo especificado.',
      'list-style': {
        'name': 'Estilo de elemento de lista',
        'description': 'El estilo de elemento de lista para usar en listas desordenadas',
      },
    },
    'yaml-key-sort': {
      'name': 'Clasificación de clave de YAML',
      'description': 'Ordena las claves de YAML según el orden y la prioridad especificados. Nota: también puede eliminar las líneas en blanco.',
      'yaml-key-priority-sort-order': {
        'name': 'Orden de clasificación de prioridad de clave de YAML',
        'description': 'El orden en el que se ordenan las claves con una en cada línea donde se ordena en el orden que se encuentra en la lista',
      },
      'priority-keys-at-start-of-yaml': {
        'name': 'Claves de prioridad al inicio del YAML',
        'description': 'El orden de clasificación de prioridad clave de YAML se coloca al comienzo del frontmatter del YAML',
      },
      'yaml-sort-order-for-other-keys': {
        'name': 'Orden de clasificación de YAML para otras claves',
        'description': 'La forma en que ordenar las claves que no se encuentran en el área de texto `Orden de clasificación de prioridad de clave de YAML`',
      },
    },
    'yaml-timestamp': {
      'name': 'Marca de tiempo de YAML',
      'description': 'Lleve un registro de la fecha en que se editó el archivo por última vez en el frente del YAML. Obtiene las fechas de los metadatos del archivo.',
      'date-created': {
        'name': 'Fecha de creación',
        'description': 'Inserte la fecha de creación del archivo',
      },
      'date-created-key': {
        'name': 'Clave de fecha de creación',
        'description': 'La clave de YAML para usar para la fecha de creación',
      },
      'date-modified': {
        'name': 'Fecha modificada',
        'description': 'Inserte la fecha en que se modificó el archivo por última vez',
      },
      'date-modified-key': {
        'name': 'Clave de fecha modificada',
        'description': 'La clave de YAML para usar para la fecha de modificación',
      },
      'format': {
        'name': 'Formato',
        'description': 'Formato de fecha de Moment a usar (ver [Opciones de formato de Moment](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/))',
      },
    },
    'yaml-title-alias': {
      'name': 'Alias de título de YAML',
      'description': 'Inserta o actualiza el título del archivo en la sección de alias de YAML frontmatter. Obtiene el título del primer H1 o nombre de archivo.',
      'preserve-existing-alias-section-style': {
        'name': 'Conservar el estilo de sección de alias existente',
        'description': 'Si se establece, la configuración `Estilo de sección de alias de YAML` se aplica solo a las secciones recién creadas',
      },
      'keep-alias-that-matches-the-filename': {
        'name': 'Mantenga el alias que coincida con el nombre del archivo',
        'description': 'Estos alias suelen ser redundantes.',
      },
      'use-yaml-key-to-keep-track-of-old-filename-or-heading': {
        'name': 'Use la clave de YAML especificado por `Clave auxiliar de alias` para ayudar con los cambios de nombre de archivo y encabezado',
        'description': 'Si se establece, cuando cambia el primer encabezado H1 o cambia el nombre de archivo si el primer H1 no está presente, el alias anterior almacenado en esta clave se reemplazará con el nuevo valor en lugar de simplemente insertar una nueva entrada en la matriz de alias.',
      },
      'alias-helper-key': {
        'name': 'Clave auxiliar de alias',
        'description': 'La clave que se debe utilizar para ayudar a realizar un seguimiento de cuál fue el último nombre de archivo o encabezado que esta regla almacenó en el frontmatter.',
      },
    },
    'yaml-title': {
      'name': 'Título de YAML',
      'description': 'Inserta el título del archivo en el frontmatter de YAML. Obtiene el título según el modo seleccionado.',
      'title-key': {
        'name': 'Clave de título',
        'description': 'La clave de YAML para usar para el título',
      },
      'mode': {
        'name': 'Modo',
        'description': 'El método a utilizar para obtener el título',
      },
    },
  },
  'enums': {
    'Title Case': 'Titulo del Caso',
    'ALL CAPS': 'TODO MAYÚSCULAS',
    'First letter': 'Primera letra',
    '.': '.', // leave as is
    ')': ')', // leave as is
    'ERROR': 'error',
    'TRACE': 'trazar',
    'DEBUG': 'depurar',
    'INFO': 'información',
    'WARN': 'advertencia',
    'SILENT': 'silencio',
    'ascending': 'ascendente',
    'lazy': 'perezoso',
    'Nothing': 'nada',
    'Remove hashtag': 'Remove hashtag',
    'Remove whole tag': 'Remove whole tag',
    'asterisk': 'asterisco',
    'underscore': 'guion bajo',
    'consistent': 'congruente',
    '-': '-', // leave as is
    '*': '*', // leave as is
    '+': '+', // leave as is
    'space': 'espacio',
    'no space': 'sin espacio',
    'None': 'nada',
    'Ascending Alphabetical': 'Ascendente alfabético',
    'Descending Alphabetical': 'Descendiente alfabético',
    'multi-line': 'multilínea',
    'single-line': 'linea sola',
    'single string to single-line': 'una sola cadena a una sola línea',
    'single string to multi-line': 'cadena única a multilínea',
    'single string comma delimited': 'cadena única delimitada por comas',
    'single string space delimited': 'espacio de una sola cadena delimitado',
    'single-line space delimited': 'espacio de una sola línea delimitado',
    'first-h1': 'primer encabezado de nivel 1',
    'first-h1-or-filename-if-h1-missing': 'primer encabezado de nivel 1 o nombre de archivo si falta el encabezado de primer nivel 1',
    'filename': 'nombre del archivo',
    '\'\'': '\'\'', // leave as is
    '‘’': '‘’', // leave as is
    '""': '""', // leave as is
    '“”': '“”', // leave as is
    // yaml.ts
    '\\': '\\', // leave as is
    '<br>': '<br>', // leave as is
    '  ': '  ', // leave as is
    '<br/>': '<br/>', // leave as is
  },
};
