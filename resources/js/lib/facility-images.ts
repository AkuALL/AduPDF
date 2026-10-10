/** File-name prefix in resources/images -> facility type. */
const prefixToType: Record<string, string> = {
    AulaSerbaguna: 'aula',
    LabKomputer: 'laboratorium',
    LapBasket: 'lapangan',
    proyektor: 'alat',
    RuangKelas: 'ruang_kelas',
};

const files = import.meta.glob<string>('../../images/*.jpg', {
    eager: true,
    import: 'default',
});

/**
 * Photos per facility type (one set per type, not per facility).
 * `Prefix.jpg` is the cover; extra shots are `Prefix_1.jpg`, `Prefix_2.jpg`, ...
 * Drop a new file in resources/images and it is picked up automatically.
 */
export const facilityImages: Record<string, string[]> = {};

Object.keys(files)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .forEach((path) => {
        const prefix = path.split('/').pop()!.replace('.jpg', '').split('_')[0];
        const type = prefixToType[prefix];

        if (type) {
            (facilityImages[type] ??= []).push(files[path]);
        }
    });
