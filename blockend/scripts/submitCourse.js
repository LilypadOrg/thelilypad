const { realpath } = require("fs");
const { ethers } = require("hardhat");

async function submitCourse() {
    const tlp = await ethers.getContract("Main");
    const courseSubmit = await tlp.submitCourse(
        100,
        "You completed the 32hr course",
        "SVGIMAGEGOESHERE"
    );
    await courseSubmit.wait(1);
    const course = await tlp.getCourse(1);
    console.log(course);
}

submitCourse()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
