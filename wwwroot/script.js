const rawXml = document.getElementById('rawXml');
const prettyXml = document.getElementById('prettyXml');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');

// On every change in the textarea
rawXml.addEventListener('input', () => {
    try {
        prettyXml.textContent = formatXml(rawXml.value);
    } catch (e) {
        prettyXml.textContent = 'Invalid XML: ' + e.message;
    }
});

// Clear both fields
clearButton.addEventListener('click', () => {
    rawXml.value = '';
    prettyXml.textContent = '';
});

// Copy the formatted XML to the clipboard
copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(prettyXml.textContent)
        .then(() => alert('Formatted XML copied to clipboard!'))
        .catch(err => alert('Failed to copy text: ' + err));
});

/**
 * Parses the XML string into a DOM and returns the formatted string.
 */
function formatXml(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // Check for parse errors (DOMParser creates a <parsererror> element on errors)
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
        throw new Error('Error parsing XML');
    }

    // Convert the DOM recursively into an indented string
    return domToString(xmlDoc.documentElement, 0);
}

/**
 * Converts a DOM node into an indented XML string.
 * - Elements with only text are output on a single line.
 * - Elements with child elements are output in a multiline format.
 */
function domToString(node, level) {
    let output = '';
    const indent = '  '.repeat(level);

    switch (node.nodeType) {
        case Node.TEXT_NODE: {
            // For text nodes: output only non-empty text
            const text = node.nodeValue.trim();
            if (text.length > 0) {
                output += indent + text + '\n';
            }
            break;
        }

        case Node.ELEMENT_NODE: {
            // Collect attributes
            let attrs = '';
            for (let i = 0; i < node.attributes.length; i++) {
                const attr = node.attributes[i];
                attrs += ` ${attr.name}="${attr.value}"`;
            }

            // Determine if the element has child elements or just text
            let childElementCount = 0;
            let textContent = '';

            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                if (child.nodeType === Node.ELEMENT_NODE) {
                    childElementCount++;
                } else if (child.nodeType === Node.TEXT_NODE) {
                    // Collect all text content
                    const txt = child.nodeValue.trim();
                    if (txt.length > 0) {
                        textContent += txt;
                    }
                }
            }

            // If there are no child elements and we have text, output in one line
            if (childElementCount === 0 && textContent) {
                output += `${indent}<${node.nodeName}${attrs}>${textContent}</${node.nodeName}>\n`;
            } else {
                // Otherwise, output in multiline format
                output += `${indent}<${node.nodeName}${attrs}>\n`;
                // Process child nodes (both text and elements) recursively
                for (let i = 0; i < node.childNodes.length; i++) {
                    output += domToString(node.childNodes[i], level + 1);
                }
                output += `${indent}</${node.nodeName}>\n`;
            }
            break;
        }

        case Node.CDATA_SECTION_NODE: {
            // CDATA section
            output += indent + `<![CDATA[${node.nodeValue}]]>\n`;
            break;
        }

        case Node.COMMENT_NODE: {
            // Comment node
            output += indent + `<!--${node.nodeValue}-->\n`;
            break;
        }

        default:
            // Ignore or handle other node types as needed
            break;
    }

    return output;
}
