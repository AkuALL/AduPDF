import aula from '../../images/AulaSerbaguna.jpg';
import laboratorium from '../../images/LabKomputer.jpg';
import lapangan from '../../images/LapBasket.jpg';
import alat from '../../images/proyektor.jpg';
import ruangKelas from '../../images/RuangKelas.jpg';

/** Facility photo keyed by facility type; one photo per type, not per facility. */
export const facilityImages: Record<string, string> = {
    ruang_kelas: ruangKelas,
    aula,
    laboratorium,
    alat,
    lapangan,
};
