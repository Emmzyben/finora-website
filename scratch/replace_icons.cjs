const fs = require('fs');
const path = require('path');

const convertToPascalCase = (str) => {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};

const replaceIcons = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    
    // Regular expression to match <i className="bi bi-something extra-classes"></i>
    // sometimes it's <i className="bi bi-something"></i>
    content = content.replace(/<i\s+className="bi\s+bi-([\w-]+)(.*?)"(.*?)\s*><\/i>/g, (match, iconName, extraClasses, otherAttrs) => {
        const componentName = 'Bs' + convertToPascalCase(iconName);
        imports.add(componentName);
        const classes = extraClasses.trim();
        const classNameAttr = classes ? ` className="${classes}"` : '';
        return `<${componentName}${classNameAttr}${otherAttrs} />`;
    });

    if (imports.size > 0) {
        const importStatement = `import { ${Array.from(imports).join(', ')} } from 'react-icons/bs';\n`;
        // Insert after first import
        content = content.replace(/import React from 'react';\n/, `import React from 'react';\n${importStatement}`);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Replaced icons in ${filePath}`);
    } else {
        console.log(`No icons found in ${filePath}`);
    }
};

replaceIcons(path.join(__dirname, '..', 'src', 'pages', 'DashboardPage.jsx'));
