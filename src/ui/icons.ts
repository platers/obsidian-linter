// icon sources
const lintFileSVG = `<svg fill="currentColor" viewBox="0 0 100 100" width="100" height="100" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
   <path d="M5 2v97.649h91.607V28.734l-.715-.663L65.356 2.597 64.56 2Zm5.09 4.246h50.892v25.473h30.536v63.684H10.089Zm55.982 3.051L87.86 27.474H66.072Z" style="stroke-width:2.32417"/>
   <g style="opacity:1;fill:none;fill-rule:nonzero;stroke:none;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" stroke-linecap="round">
      <path d="M89.161 11.093a1 1 0 0 0-1.656-.392l-7.189 7.189a5.765 5.765 0 0 1-4.104 1.7 5.768 5.768 0 0 1-4.104-1.699 5.811 5.811 0 0 1 0-8.207l7.189-7.189a1 1 0 0 0-.392-1.656C73.042-1.106 66.689.39 62.335 4.745a16.177 16.177 0 0 0-3.792 16.948l-36.85 36.851a16.18 16.18 0 0 0-16.948 3.792C.39 66.691-1.107 73.04.838 78.906a.998.998 0 0 0 1.656.392l7.189-7.189a5.81 5.81 0 0 1 8.207 0 5.764 5.764 0 0 1 1.699 4.104 5.763 5.763 0 0 1-1.7 4.104L10.7 87.506a.999.999 0 0 0 .392 1.656c1.7.563 3.44.839 5.16.839 4.218 0 8.317-1.652 11.41-4.745a16.177 16.177 0 0 0 3.793-16.948l36.851-36.851a16.177 16.177 0 0 0 16.948-3.793c4.357-4.355 5.853-10.705 3.907-16.571z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.59252 0 0 .54674 22.478 41.225)"/>
      <path d="M72.088 57.275a1.003 1.003 0 0 0-.662-.292c-3.462-.155-7.078-1.876-9.923-4.721-1.742-1.743-3.065-3.782-3.863-5.897L46.517 57.488c2.115.799 4.154 2.121 5.897 3.863 2.845 2.846 4.565 6.462 4.721 9.923.012.249.115.485.292.662l14.876 14.876a10.334 10.334 0 0 0 7.33 3.031c2.655 0 5.311-1.01 7.331-3.031 4.041-4.042 4.041-10.619 0-14.661zM5.351 14.171c.123.219.324.384.563.462l5.82 1.89 23.869 23.869 4.638-4.638-23.869-23.869-1.891-5.82a1.003 1.003 0 0 0-.462-.563L4.714.279a1 1 0 0 0-1.196.165L.293 3.668a1 1 0 0 0-.165 1.196Z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.59252 0 0 .54674 22.478 41.225)"/>
   </g>
</svg>`;

const lintFolderSVG = `<svg width="100" height="100" viewBox="0 0 100 100" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
   <g style="opacity:1;fill:none;fill-rule:nonzero;stroke:none;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" stroke-linecap="round">
      <path d="M89.161 11.093a1 1 0 0 0-1.656-.392l-7.189 7.189a5.765 5.765 0 0 1-4.104 1.7 5.768 5.768 0 0 1-4.104-1.699 5.811 5.811 0 0 1 0-8.207l7.189-7.189a1 1 0 0 0-.392-1.656C73.042-1.106 66.689.39 62.335 4.745a16.177 16.177 0 0 0-3.792 16.948l-36.85 36.851a16.18 16.18 0 0 0-16.948 3.792C.39 66.691-1.107 73.04.838 78.906a.998.998 0 0 0 1.656.392l7.189-7.189a5.81 5.81 0 0 1 8.207 0 5.764 5.764 0 0 1 1.699 4.104 5.763 5.763 0 0 1-1.7 4.104L10.7 87.506a.999.999 0 0 0 .392 1.656c1.7.563 3.44.839 5.16.839 4.218 0 8.317-1.652 11.41-4.745a16.177 16.177 0 0 0 3.793-16.948l36.851-36.851a16.177 16.177 0 0 0 16.948-3.793c4.357-4.355 5.853-10.705 3.907-16.571z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.57187 0 0 .39802 28.922 50.846)"/>
      <path d="M72.088 57.275a1.003 1.003 0 0 0-.662-.292c-3.462-.155-7.078-1.876-9.923-4.721-1.742-1.743-3.065-3.782-3.863-5.897L46.517 57.488c2.115.799 4.154 2.121 5.897 3.863 2.845 2.846 4.565 6.462 4.721 9.923.012.249.115.485.292.662l14.876 14.876a10.334 10.334 0 0 0 7.33 3.031c2.655 0 5.311-1.01 7.331-3.031 4.041-4.042 4.041-10.619 0-14.661zM5.351 14.171c.123.219.324.384.563.462l5.82 1.89 23.869 23.869 4.638-4.638-23.869-23.869-1.891-5.82a1.003 1.003 0 0 0-.462-.563L4.714.279a1 1 0 0 0-1.196.165L.293 3.668a1 1 0 0 0-.165 1.196Z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.57187 0 0 .39802 28.922 50.846)"/>
   </g>
   <g style="opacity:1;fill:none;fill-rule:nonzero;stroke:none;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none">
      <path d="M89.234 35.526a3.794 3.794 0 0 0-3.065-1.536H74.085v-8.511a5.187 5.187 0 0 0-5.181-5.181H44.128a2.196 2.196 0 0 1-1.542-.639l-7.588-7.588a5.144 5.144 0 0 0-3.664-1.518H5.181A5.188 5.188 0 0 0 0 15.735v59.569a4.147 4.147 0 0 0 4.142 4.143h70.075c2.389 0 4.245-1.737 5.093-4.753l10.531-35.792c.344-1.17.124-2.4-.607-3.376zM4.142 76.446c-.63 0-1.142-.513-1.142-1.143V15.735c0-1.203.978-2.181 2.181-2.181h26.154c.574 0 1.136.233 1.542.639l7.588 7.588a5.144 5.144 0 0 0 3.664 1.518h24.776c1.202 0 2.181.978 2.181 2.181v8.511h-50.05a5.292 5.292 0 0 0-5.065 3.817L5.342 74.893c-.442 1.553-.954 1.553-1.2 1.553Zm82.821-38.392-10.537 35.81c-.331 1.179-.983 2.582-2.222 2.582H7.985c.086-.227.167-.469.241-.729l10.629-37.083a2.278 2.278 0 0 1 2.181-1.644h65.133c.36 0 .57.208.663.333a.813.813 0 0 1 .131.731z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(1.06512 0 0 1.385 3.167 -10.742)"/>
   </g>
</svg>`;

const lintVaultSVG = `<svg width="100" height="100" viewBox="0 0 100 100" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
   <g style="opacity:1;fill:none;fill-rule:nonzero;stroke:none;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(1.07096 0 0 1.20147 1.964 -4.212)">
      <path d="M90 84.505H0V5.495h90zm-86-4h82V9.495H4Z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
      <path d="M90 32.695H0v-27.2h90zm-86-4h82v-19.2H4Z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
      <rect x="9.58" y="17.09" rx="0" ry="0" width="3.07" height="4" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
      <rect x="16.45" y="17.09" rx="0" ry="0" width="3.07" height="4" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
      <rect x="23.31" y="17.09" rx="0" ry="0" width="3.07" height="4" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
      <rect x="36.55" y="17.09" rx="0" ry="0" width="43.88" height="4" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none"/>
   </g>
   <g style="opacity:1;fill:none;fill-rule:nonzero;stroke:none;stroke-width:0;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" stroke-linecap="round">
      <path d="M89.161 11.093a1 1 0 0 0-1.656-.392l-7.189 7.189a5.765 5.765 0 0 1-4.104 1.7 5.768 5.768 0 0 1-4.104-1.699 5.811 5.811 0 0 1 0-8.207l7.189-7.189a1 1 0 0 0-.392-1.656C73.042-1.106 66.689.39 62.335 4.745a16.177 16.177 0 0 0-3.792 16.948l-36.85 36.851a16.18 16.18 0 0 0-16.948 3.792C.39 66.691-1.107 73.04.838 78.906a.998.998 0 0 0 1.656.392l7.189-7.189a5.81 5.81 0 0 1 8.207 0 5.764 5.764 0 0 1 1.699 4.104 5.763 5.763 0 0 1-1.7 4.104L10.7 87.506a.999.999 0 0 0 .392 1.656c1.7.563 3.44.839 5.16.839 4.218 0 8.317-1.652 11.41-4.745a16.177 16.177 0 0 0 3.793-16.948l36.851-36.851a16.177 16.177 0 0 0 16.948-3.793c4.357-4.355 5.853-10.705 3.907-16.571z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.66714 0 0 .51336 18.867 41.049)"/>
      <path d="M72.088 57.275a1.003 1.003 0 0 0-.662-.292c-3.462-.155-7.078-1.876-9.923-4.721-1.742-1.743-3.065-3.782-3.863-5.897L46.517 57.488c2.115.799 4.154 2.121 5.897 3.863 2.845 2.846 4.565 6.462 4.721 9.923.012.249.115.485.292.662l14.876 14.876a10.334 10.334 0 0 0 7.33 3.031c2.655 0 5.311-1.01 7.331-3.031 4.041-4.042 4.041-10.619 0-14.661zM5.351 14.171c.123.219.324.384.563.462l5.82 1.89 23.869 23.869 4.638-4.638-23.869-23.869-1.891-5.82a1.003 1.003 0 0 0-.462-.563L4.714.279a1 1 0 0 0-1.196.165L.293 3.668a1 1 0 0 0-.165 1.196Z" style="opacity:1;fill:currentColor;fill-rule:nonzero;stroke:none;stroke-width:1;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:10;stroke-dasharray:none" transform="matrix(.66714 0 0 .51336 18.867 41.049)"/>
   </g>
</svg>`;

// copied SVG info

// https://icon-sets.iconify.design/codicon/whitespace/
const whitespaceSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
   <path fill="currentColor" d="M75 12.5V6.25H40.625a21.875 21.875 0 0 0 0 43.75H50v31.25h-6.25v6.25H75v-6.25h-6.25V12.5H75zM50 43.75h-9.375a15.625 15.625 0 1 1 0-31.25H50v31.25zm12.5 37.5h-6.25V12.5h6.25v68.75z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/math-formula-20-filled/
const mathSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 125 125">
   <path fill="currentColor" d="M55.719 22.131c1.812-.25 2.956-.213 3.831-.037a9.375 9.375 0 0 1 3.038 1.3 4.688 4.688 0 1 0 4.825-8.037 18.606 18.606 0 0 0-6.025-2.45c-2.244-.45-4.525-.406-7.05-.044l-.112.013c-5 .838-8.919 3.419-11.594 7.262-2.581 3.725-3.831 8.375-4.188 13.281a4.688 4.688 0 0 0-.006.331v.05l-.006.15-.019.519-.081 1.688c-.063 1.387-.169 3.25-.287 5.45l-.031.581H30a4.688 4.688 0 0 0 0 9.375h7.469l-.356 6.05a2608.581 2608.581 0 0 1-1.794 28.263c-.669 8.025-1.375 13.362-6.419 16.313-2.519 1.431-6.369 1.344-10.563-.75a4.688 4.688 0 0 0-4.188 8.375c5.794 2.906 13.188 4.069 19.419.506l.037-.019c9.581-5.594 10.425-15.937 11-22.912l.063-.75v-.031c.369-4.8 1.406-21.625 2.188-35.044h11.269a4.688 4.688 0 0 0 0-9.375H47.4c.231-4.175.388-7.225.406-8.225.287-3.788 1.219-6.594 2.525-8.475 1.231-1.769 2.919-2.938 5.388-3.356Zm49.156 42.125a4.688 4.688 0 1 0-6.625-6.631L82.131 73.738a226.175 226.175 0 0 1-4.75-8.463l-.456-.725c-.956-1.531-2.381-3.819-4.112-5.419a10.056 10.056 0 0 0-4.6-2.519 9.662 9.662 0 0 0-5.981.631 4.688 4.688 0 0 0-.875.494l-.206.137a11.125 11.125 0 0 0-1.769 1.456c-.281.294-.563.625-.825.931l-.137.163-1.025 1.188a4.688 4.688 0 0 0 7.087 6.144l1.081-1.263.131-.156c.263-.313.363-.425.419-.481l.075-.056c.063.037.144.106.256.213.356.325.781.844 1.325 1.644a48.75 48.75 0 0 1 1.05 1.619l.55.875c.756 1.469 3.063 5.606 5.912 10.438L57.625 98.25a4.688 4.688 0 1 0 6.625 6.625l16.637-16.631a240.988 240.988 0 0 1 5.1 9.069l.313.544c.813 1.381 2.188 3.731 4 5.45 1.125 1.069 2.637 2.125 4.581 2.637a10.038 10.038 0 0 0 6.6-.6c2.225-1.113 3.6-2.55 5.025-4.869a4.688 4.688 0 0 0-8-4.894 5.95 5.95 0 0 1-.787 1.1.938.938 0 0 1-.2.156 1.163 1.163 0 0 1-.206.037h-.044s-.044-.013-.125-.063a2.419 2.419 0 0 1-.394-.313 9.156 9.156 0 0 1-1.269-1.606 37.587 37.587 0 0 1-.988-1.613l-.375-.644a289.688 289.688 0 0 0-6.381-11.244l17.137-17.144ZM66.25 65.768Zm-.013 0h.013Z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/slide-text-20-regular/
const contentSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 125 125">
   <path fill="currentColor" d="M34.375 43.75a3.125 3.125 0 0 0 0 6.25h25a3.125 3.125 0 0 0 0 -6.25h-25Zm0 15.625a3.125 3.125 0 0 0 0 6.25h43.75a3.125 3.125 0 0 0 0 -6.25h-43.75Zm-3.125 18.75a3.125 3.125 0 0 1 3.125 -3.125h31.25a3.125 3.125 0 0 1 0 6.25h-31.25a3.125 3.125 0 0 1 -3.125 -3.125ZM28.125 25A15.625 15.625 0 0 0 12.5 40.625v43.75A15.625 15.625 0 0 0 28.125 100h68.75a15.625 15.625 0 0 0 15.625 -15.625v-43.75A15.625 15.625 0 0 0 96.875 25h-68.75ZM18.75 40.625A9.375 9.375 0 0 1 28.125 31.25h68.75A9.375 9.375 0 0 1 106.25 40.625v43.75a9.375 9.375 0 0 1 -9.375 9.375h-68.75A9.375 9.375 0 0 1 18.75 84.375v-43.75Z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/clipboard-text-ltr-20-regular/
const pasteSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 125 125">
   <path fill="currentColor" d="M40.625 50a3.125 3.125 0 0 0 0 6.25h43.75a3.125 3.125 0 0 0 0-6.25h-43.75ZM37.5 71.875a3.125 3.125 0 0 1 3.125-3.125h18.75a3.125 3.125 0 0 1 0 6.25h-18.75a3.125 3.125 0 0 1-3.125-3.125ZM40.625 87.5a3.125 3.125 0 0 0 0 6.25h31.25a3.125 3.125 0 0 0 0-6.25h-31.25Zm12.5-75a9.375 9.375 0 0 0-8.844 6.25h-9.906A9.375 9.375 0 0 0 25 28.125v75a9.375 9.375 0 0 0 9.375 9.375h56.25a9.375 9.375 0 0 0 9.375-9.375v-75a9.375 9.375 0 0 0-9.375-9.375h-9.906a9.375 9.375 0 0 0-8.844-6.25h-18.75Zm18.75 6.25a3.125 3.125 0 0 1 0 6.25h-18.75a3.125 3.125 0 0 1 0-6.25h18.75ZM34.375 25h9.906a9.375 9.375 0 0 0 8.844 6.25h18.75A9.375 9.375 0 0 0 80.719 25h9.906a3.125 3.125 0 0 1 3.125 3.125v75a3.125 3.125 0 0 1-3.125 3.125h-56.25a3.125 3.125 0 0 1-3.125-3.125v-75A3.125 3.125 0 0 1 34.375 25Z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/book-add-20-regular/
const addBookSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 125 125">
   <path fill="currentColor" d="M87.5 18.75h-50A6.25 6.25 0 0 0 31.25 25v68.75h25.138a34.375 34.375 0 0 0 1.156 6.25H31.25a6.25 6.25 0 0 0 6.25 6.25H60a34.63 34.63 0 0 0 4.106 6.25H37.5A12.5 12.5 0 0 1 25 100V25a12.5 12.5 0 0 1 12.5-12.5h50A12.5 12.5 0 0 1 100 25v32.544a34.25 34.25 0 0 0-6.25-1.156V25a6.25 6.25 0 0 0-6.25-6.25Zm-50 12.5v6.25a6.25 6.25 0 0 0 6.25 6.25h37.5a6.25 6.25 0 0 0 6.25-6.25v-6.25A6.25 6.25 0 0 0 81.25 25h-37.5a6.25 6.25 0 0 0-6.25 6.25Zm6.25 0h37.5v6.25h-37.5v-6.25Zm75 59.375a28.125 28.125 0 1 1-56.25 0 28.125 28.125 0 0 1 56.25 0Zm-25-12.5a3.125 3.125 0 0 0-6.25 0V87.5h-9.375a3.125 3.125 0 0 0 0 6.25H87.5v9.375a3.125 3.125 0 0 0 6.25 0V93.75h9.375a3.125 3.125 0 0 0 0-6.25H93.75v-9.375Z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/text-header-1-20-filled/
const headingSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 125 125">
   <path fill="currentColor" d="M103.581 23.894a4.688 4.688 0 0 0-6.613 3.313c-1.594 7.112-8.175 16.3-16.756 22.019a4.688 4.688 0 1 0 5.2 7.8 54.806 54.806 0 0 0 11.463-10.338v50.187a4.688 4.688 0 0 0 9.375 0v-68.65a4.688 4.688 0 0 0-2.669-4.331Zm-81.706 4.231a4.688 4.688 0 1 0-9.375 0v68.75a4.688 4.688 0 0 0 9.375 0v-31.25h31.25v31.25a4.688 4.688 0 0 0 9.375 0v-68.75a4.688 4.688 0 1 0-9.375 0V56.25h-31.25V28.125Z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/text-footnote-20-filled/
const footerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 125 125">
   <path fill="currentColor" d="M108.187 18.75a4.688 4.688 0 0 1 4.313 4.675v34.388a4.688 4.688 0 0 1-9.375 0V38.206a27.531 27.531 0 0 1-1.944 1.431 4.688 4.688 0 0 1-5.2-7.806c3.85-2.563 6.644-6.638 7.25-9.406a4.669 4.669 0 0 1 4.956-3.675ZM63.75 94.188a4.913 4.913 0 0 1-1.25-3.413V41.294a5.188 5.188 0 0 1 1.325-3.606l.025-.025a4.75 4.75 0 0 1 3.519-1.463 4.625 4.625 0 0 1 3.5 1.475c.938.994 1.375 2.244 1.375 3.625v14.669a15.53 15.53 0 0 1 3.006-2.288l.013-.006c2.481-1.438 5.25-2.15 8.275-2.15 5.438 0 9.925 2.063 13.3 6.162 3.356 4.075 4.956 9.412 4.956 15.862 0 6.469-1.6 11.819-4.956 15.9-3.381 4.081-7.906 6.125-13.419 6.125-3.081 0-5.894-.706-8.388-2.156h-.006a15.619 15.619 0 0 1-3.094-2.375 4.656 4.656 0 0 1-4.787 4.525 4.519 4.519 0 0 1-3.375-1.356l-.019-.025Zm11.313-11c1.862 2.325 4.181 3.438 7.062 3.438 3.05 0 5.344-1.106 7.062-3.313 1.75-2.275 2.712-5.475 2.712-9.763 0-4.263-.963-7.456-2.719-9.738-1.719-2.231-4.013-3.344-7.056-3.344-2.875 0-5.194 1.125-7.062 3.475-1.856 2.344-2.856 5.5-2.856 9.606 0 4.125 1 7.294 2.85 9.638Zm-64.125 7.543c0 1.319.531 2.469 1.519 3.344l.043.05a5.5 5.5 0 0 0 3.562 1.194 5 5 0 0 0 3.081-.975 5.731 5.731 0 0 0 1.875-2.694l4.662-12.662h20.462l4.694 12.662a5.719 5.719 0 0 0 1.875 2.688 5 5 0 0 0 3.087.981 5.375 5.375 0 0 0 3.55-1.213 4.313 4.313 0 0 0 1.581-3.375c0-.775-.219-1.625-.537-2.469L41.954 40.224a6.888 6.888 0 0 0-2.288-3.163 6.037 6.037 0 0 0-3.65-1.125c-1.4 0-2.688.344-3.781 1.125a6.8 6.8 0 0 0-2.362 3.206l-18.4 47.994a7.125 7.125 0 0 0-.537 2.469ZM42.987 70h-14.1l7.051-19.35 7.05 19.356Z"/>
</svg>`;

// https://icon-sets.iconify.design/file-icons/yaml-alt4/
const yamlSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 3200 3200">
   <path fill="currentColor" d="m1473.706 130.869l-573.844 860.463v545.469H548.138v-545.469L0 130.869h395.313l348.55 554.038l351.406 -554.038h378.438zm590.631 1093.281H1427.706l-129.481 312.65H1016.313l596.125 -1405.931h288.356l571.938 1405.931h-301.225l-107.175 -312.65zm-105.75 -279.588l-195.162 -515.938l-217.731 515.938h412.887zM548.131 1691.187v1377.938h295.644V2118.638l309.406 638.875h232.713l319.975 -661.331v972.663h283.619V1691.187h-387.25l-343.606 623.163l-327.25 -623.163h-383.25zM3200 2770H2472.737V1691.187h-301.225v1372.013H3200v-293.188z"/>
</svg>`;

// https://icon-sets.iconify.design/fluent/settings-20-regular/
const settingsSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
   <path fill="currentColor" d="M9.55 36.915a42.455 42.455 0 0 1 8.9-15.4 2.5 2.5 0 0 1 2.7-.675l9.59 3.43a5 5 0 0 0 6.6-3.81l1.83-10.03a2.5 2.5 0 0 1 1.94-2 42.66 42.66 0 0 1 17.775 0 2.5 2.5 0 0 1 1.935 2l1.835 10.03a5 5 0 0 0 6.6 3.81l9.59-3.43a2.5 2.5 0 0 1 2.7.68 42.455 42.455 0 0 1 8.9 15.395 2.5 2.5 0 0 1-.76 2.675l-7.775 6.6a5 5 0 0 0 0 7.62l7.775 6.6a2.5 2.5 0 0 1 .76 2.675 42.455 42.455 0 0 1-8.9 15.4 2.5 2.5 0 0 1-2.7.675l-9.59-3.43a5 5 0 0 0-6.6 3.81L60.82 89.575a2.5 2.5 0 0 1-1.935 1.995 42.65 42.65 0 0 1-17.775 0 2.5 2.5 0 0 1-1.94-2l-1.825-10.03a5 5 0 0 0-6.6-3.81l-9.595 3.43a2.5 2.5 0 0 1-2.7-.68 42.45 42.45 0 0 1-8.9-15.395 2.5 2.5 0 0 1 .765-2.675l7.77-6.6a5 5 0 0 0 0-7.62l-7.77-6.6a2.5 2.5 0 0 1-.765-2.675Zm5.305-.03 6.47 5.49a10 10 0 0 1 0 15.25l-6.475 5.49a37.45 37.45 0 0 0 6.225 10.76l7.98-2.85a10 10 0 0 1 13.2 7.625l1.525 8.34a37.78 37.78 0 0 0 12.425 0l1.525-8.35a9.99 9.99 0 0 1 13.2-7.62l7.985 2.855a37.46 37.46 0 0 0 6.225-10.76l-6.47-5.49a9.99 9.99 0 0 1 0-15.25l6.47-5.49a37.455 37.455 0 0 0-6.225-10.76l-7.98 2.85a10 10 0 0 1-13.2-7.62l-1.53-8.345a37.775 37.775 0 0 0-12.425 0l-1.52 8.345a10 10 0 0 1-13.205 7.625l-7.98-2.855a37.455 37.455 0 0 0-6.225 10.76ZM37.5 50a12.5 12.5 0 1 1 25 0 12.5 12.5 0 0 1-25 0Zm5 0a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0Z"/>
</svg>`;

// https://icon-sets.iconify.design/mdi/bug-play-outline/
const debugSVG = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" version="1.1">
   <g id="surface1">
      <path fill="currentColor" style=" stroke:none;fill-rule:nonzero;fill-opacity:1;" d="M 79.167969 29.167969 L 67.457031 29.167969 C 65.582031 25.832031 63 22.917969 59.875 20.832031 L 66.667969 14.207031 L 60.792969 8.332031 L 51.75 17.375 C 47.875 16.433594 43.832031 16.433594 39.957031 17.375 L 30.875 8.332031 L 25 14.207031 L 31.75 20.832031 C 28.625 22.917969 26.082031 25.875 24.207031 29.167969 L 12.5 29.167969 L 12.5 37.5 L 21.207031 37.5 C 20.957031 38.875 20.832031 40.25 20.832031 41.667969 L 20.832031 45.832031 L 12.5 45.832031 L 12.5 54.167969 L 20.832031 54.167969 L 20.832031 58.332031 C 20.832031 59.75 20.957031 61.125 21.207031 62.5 L 12.5 62.5 L 12.5 70.832031 L 24.207031 70.832031 C 30.238281 81.238281 42.824219 85.878906 54.167969 81.875 L 54.167969 79.167969 C 54.167969 76.792969 54.542969 74.417969 55.207031 72.125 C 52.457031 74 49.167969 75 45.832031 75 C 36.625 75 29.167969 67.542969 29.167969 58.332031 L 29.167969 41.667969 C 29.167969 32.457031 36.625 25 45.832031 25 C 55.042969 25 62.5 32.457031 62.5 41.667969 L 62.5 58.332031 C 62.5 59.125 62.5 59.957031 62.292969 60.75 C 64.75 58.5 67.667969 56.75 70.832031 55.625 L 70.832031 54.167969 L 79.167969 54.167969 L 79.167969 45.832031 L 70.832031 45.832031 L 70.832031 41.667969 C 70.832031 40.25 70.707031 38.875 70.457031 37.5 L 79.167969 37.5 L 79.167969 29.167969 M 54.167969 37.5 L 54.167969 45.832031 L 37.5 45.832031 L 37.5 37.5 L 54.167969 37.5 M 54.167969 54.167969 L 54.167969 62.5 L 37.5 62.5 L 37.5 54.167969 L 54.167969 54.167969 M 70.832031 66.667969 L 70.832031 91.667969 L 91.667969 79.167969 Z M 70.832031 66.667969 "/>
   </g>
</svg>
`;

// https://github.com/nyable/obsidian-code-block-enhancer/blob/bb0c636c1e7609b6d26c48a8d7ca15d5cd9abdcf/src/core.ts#L9C29-L9C629
const clipboardSVG = `<svg viewBox="0 0 16 16" version="1.1" data-view-component="true" class="copy" xmlns="http://www.w3.org/2000/svg">
   <path fill-rule="evenodd" d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z"></path>
</svg>
`;

// https://github.com/nyable/obsidian-code-block-enhancer/blob/bb0c636c1e7609b6d26c48a8d7ca15d5cd9abdcf/src/core.ts#L10
const successSVG = `<svg viewBox="0 0 16 16" version="1.1" data-view-component="true" class="copy-success" xmlns="http://www.w3.org/2000/svg">
   <path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path>
</svg>
`;

// exported SVG info

export const iconInfo: Record<string, {id: string, source: string}> = {
  folder: {id: 'lint-folder', source: lintFolderSVG},
  file: {id: 'lint-file', source: lintFileSVG},
  vault: {id: 'lint-vault', source: lintVaultSVG},
  whitespace: {id: 'lint-whitespace', source: whitespaceSVG},
  math: {id: 'lint-math', source: mathSVG},
  content: {id: 'lint-content', source: contentSVG},
  paste: {id: 'lint-paste', source: pasteSVG},
  custom: {id: 'lint-custom', source: addBookSVG},
  heading: {id: 'lint-heading', source: headingSVG},
  footer: {id: 'lint-footer', source: footerSVG},
  yaml: {id: 'lint-yaml', source: yamlSVG},
  general: {id: 'lint-general', source: settingsSVG},
  debug: {id: 'lint-debug', source: debugSVG},
  clipboard: {id: 'linter-clipboard', source: clipboardSVG},
  success: {id: 'linter-success', source: successSVG},
} as const;
