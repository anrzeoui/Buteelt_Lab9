import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient();


async function detectLogo(fileName: string): Promise<void> {
    try {
        console.log(`Running logo detection on ${fileName}`);
        const [result] = await client.logoDetection(fileName);
        const logos = result.logoAnnotations;

        if (logos && logos.length > 0) {
            let totalScore = 0;
            logos.forEach((logo) => {
                if (logo.description) {
                    console.log(`"${logo.description}" found in file ${fileName}`);
                }
                if (logo.score) {
                    totalScore += logo.score;
                }
            });
            const avg = totalScore / logos.length;
            console.log(`Average score for ${fileName}: ${avg}`);
        } else {
            console.log(`No logos found in ${fileName}`);
        }
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            console.log(`File ${fileName} not found`);
        } else {
            console.log(`Error: ${err.message}`);
        }
    }
}

async function mainAsync(fileNames: string[]): Promise<void> {
    for (const fileName of fileNames) {
        await detectLogo(fileName);
    }
}

function main(fileNames: string[]): void {
    fileNames.forEach((fileName) => {
        detectLogo(fileName);
    });
}

const files = [
    './images/cmu.jpg', 
    './images/logo-types-collection.jpg', 
    './images/not-a-file.jpg'
];

console.log("--- Running main (Promise version) ---");
main(files);

console.log("\n--- Running mainAsync (Async/Await version) ---");
mainAsync(files);