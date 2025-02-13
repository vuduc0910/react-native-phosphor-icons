import fs from "fs-extra";
import path from "node:path";

import { transform } from "@svgr/core";
import { pascalCase } from "change-case";

const weights = {
  regular: "regular",
  fill: "fill",
  bold: "bold",
};

const svgsDir = path.join(
  __dirname,
  "../node_modules/@phosphor-icons/core/assets"
);

const srcDir = path.join(__dirname, "../src");

const getIconList = () => {
  const files = fs
    .readdirSync(path.join(svgsDir, "regular"))
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.replace(".svg", ""));

  return files;
};

const componentNameMap = {
  Circle: "CircleIcon",
  Path: "PathIcon",
  Infinity: "InfinityIcon",
};

const convertSvgToJsx = async (svgCode: string, componentName: string) => {
  let code = await transform(
    svgCode,
    {
      icon: true,
      native: true,
      typescript: true,
      svgProps: {
        width: "{props.size}",
        height: "{props.size}",
        fill: "{props.color}",
      },
      plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    },
    {
      componentName,
    }
  );

  code = code
    .replace(`xmlns="http://www.w3.org/2000/svg" `, "")
    .replace(/import type .*;\n/g, "")
    .replace("const", `import { IconProps } from '../types'\nconst`)
    .replace("props: SvgProps", "props: IconProps");

  return code;
};

const generateIconByWeight = async (icon: string, weight: string) => {
  const iconName = weight === "regular" ? icon : `${icon}-${weight}`;
  const componentName = componentNameMap[pascalCase(icon)] || pascalCase(icon);
  const filePath = path.join(svgsDir, `${weight}/${iconName}.svg`);
  const svgCode = fs.readFileSync(filePath, {
    encoding: "utf-8",
  });
  const tsCode = await convertSvgToJsx(svgCode, componentName);

  const outDir = path.join(srcDir, weight);
  const fileName = `${componentName}.tsx`;

  fs.ensureDirSync(outDir);

  fs.writeFileSync(
    path.join(outDir, fileName),
    `/* Generated code. Do not edit.*/\n${tsCode}`
  );
};

const generateMainIconFile = async (icon: string) => {
  const componentName = componentNameMap[pascalCase(icon)] || pascalCase(icon);
  const content = `import { useMemo } from 'react'
import { IconProps } from '../types'
import regular from '../regular/${componentName}'
import fill from '../fill/${componentName}'
import bold from '../bold/${componentName}'

function ${componentName}(props: IconProps) {
  const {
    color = '#000',
    size = 24,
    weight = 'regular',
    mirrored = false,
    style
  } = props

  const weightMap = {
    fill,
    regular,
    bold,
  }

  const IconComponent = useMemo(() => {
    return weightMap[weight]
  }, [weight])

  return (
    <IconComponent
      color={color}
      size={size}
      style={[style, ...[mirrored && { transform: 'scaleX(-1)' }]]}
    />
  )
}

export default ${componentName}
  `;

  fs.ensureDirSync(path.join(srcDir, "icons"));

  fs.writeFileSync(
    path.join(srcDir, `icons/${componentName}.tsx`),
    `/* Generated code. Do not edit.*/\n${content}`
  );
};

const generateAllIconsByWeight = async () => {
  const icons = getIconList();

  for (const weight of Object.keys(weights)) {
    for (const icon of icons) {
      generateIconByWeight(icon, weight);
      console.log(`Generated: ${weight}/${icon}`);
    }
  }
};

const generateAllIconsMainFile = async () => {
  const icons = getIconList();

  for (const icon of icons) {
    generateMainIconFile(icon);
    console.log(`Generated: icons/${icon}`);
  }
};

const generateIndexFile = async () => {
  const icons = getIconList();
  let content = "/* Generated code. Do not edit. */\n";

  content += icons
    .map((icon) => {
      const componentName =
        componentNameMap[pascalCase(icon)] || pascalCase(icon);
      return `export { default as ${componentName} } from './icons/${componentName}'`;
    })
    .join("\n");

  fs.writeFileSync(path.join(srcDir, "index.ts"), content);
};

const cleanup = async () => {
  // Remove weight folders
  for (const weight of Object.keys(weights)) {
    fs.removeSync(path.join(srcDir, weight));
  }

  // Remove icons folder
  fs.removeSync(path.join(srcDir, "icons"));
};

// Start generating
cleanup();
generateAllIconsByWeight();
generateAllIconsMainFile();
generateIndexFile();
