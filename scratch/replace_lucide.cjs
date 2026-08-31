const fs = require('fs');
const path = require('path');

const map = {
    'BsCalendar3': 'Calendar',
    'BsWallet2': 'Wallet',
    'BsBell': 'Bell',
    'BsBuilding': 'Building',
    'BsSend': 'Send',
    'BsPlusLg': 'Plus',
    'BsClockHistory': 'Clock',
    'BsGraphUpArrow': 'TrendingUp',
    'BsGraphDownArrow': 'TrendingDown',
    'BsSpeedometer2': 'Gauge',
    'BsEyeSlash': 'EyeOff',
    'BsShieldCheck': 'ShieldCheck',
    'BsGraphUp': 'TrendingUp',
    'BsCreditCard': 'CreditCard',
    'BsChevronRight': 'ChevronRight',
    'BsPerson': 'User',
    'BsGlobe': 'Globe',
    'BsClock': 'Clock',
    'BsBarChart': 'BarChart',
    'BsCalendar': 'Calendar',
    'BsQuestionLg': 'HelpCircle',
    'BsChatDots': 'MessageCircle',
    'BsInfoCircle': 'Info',
    'BsBoxArrowRight': 'LogOut',
    'BsHouseDoor': 'Home',
    'BsBoxArrowInDown': 'Download',
    'BsFileEarmarkText': 'FileText',
    'BsCurrencyDollar': 'DollarSign',
    'BsGear': 'Settings',
    'BsQuestionCircle': 'HelpCircle'
};

const replaceInFile = (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace imports
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+'react-icons\/bs';/g, (match, importsStr) => {
        const imports = importsStr.split(',').map(s => s.trim()).filter(Boolean);
        const newImports = new Set();
        imports.forEach(imp => {
            if (map[imp]) {
                newImports.add(map[imp]);
            } else {
                console.warn(`No mapping found for ${imp}`);
            }
        });
        return `import { ${Array.from(newImports).join(', ')} } from 'lucide-react';`;
    });

    // Replace components
    for (const [bsIcon, lucideIcon] of Object.entries(map)) {
        const regex = new RegExp(`<${bsIcon}\\b([^>]*)>`, 'g');
        content = content.replace(regex, `<${lucideIcon}$1>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
};

replaceInFile(path.join(__dirname, '..', 'src', 'pages', 'DashboardPage.jsx'));
replaceInFile(path.join(__dirname, '..', 'src', 'components', 'DashboardSidebar.jsx'));
