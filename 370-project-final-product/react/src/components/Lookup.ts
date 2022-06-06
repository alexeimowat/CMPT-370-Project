interface imageData {
    src: string;
    alt: string;
    title: string;
}

function imageLookup(name: string): imageData {

    // TODO - If more images are used in the project, create a mapping of title to imageData
    return { src: "/scheduleTitleLabel.png", alt: "Icon of a schedule", title: "Give your schedule a title!" };
}

export default imageLookup;
