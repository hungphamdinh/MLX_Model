export function compareVersion(a_components, b_components) {

    if (a_components === b_components) {
        return 0;
    }

    let partsNumberA = a_components.split(".");
    let partsNumberB = b_components.split(".");
    if (partsNumberA.length === 2) {
        partsNumberA.push("0")
    }
    if (partsNumberB.length === 2) {
        partsNumberB.push("0")
    }

    for (let i = 0; i < partsNumberA.length; i++) {

        let valueA = parseInt(partsNumberA[i]);
        let valueB = parseInt(partsNumberB[i]);

        // A bigger than B
        if (valueA > valueB || isNaN(valueB)) {
            return 1;
        }

        // B bigger than A
        if (valueA < valueB) {
            return -1;
        }
    }
    return  0
}
