// scales families dictionary
const scaleFamiliesDict: Map<string, Array<number>> = new Map<string, Array<number>>();

// 8 notes
scaleFamiliesDict.set("8bebop_dom",      [0, 2, 4, 5, 7, 9, 10, 11]);
scaleFamiliesDict.set("8bebop_maj",      [0, 2, 4, 5, 7, 8, 9, 11]);
scaleFamiliesDict.set("8bebop_min_melo", [0, 2, 3, 5, 7, 8, 9, 11]);
scaleFamiliesDict.set("8spanish",        [0, 1, 3, 4, 5, 6, 8, 10]);
scaleFamiliesDict.set("8dim",            [0, 2, 3, 5, 6, 8, 9, 11]);

// 7 notes
scaleFamiliesDict.set("7major_nat",   [0, 2, 4, 5, 7, 9, 11]);
scaleFamiliesDict.set("7minor_harm",  [0, 2, 3, 5, 7, 8, 11]);
scaleFamiliesDict.set("7minor_melo",  [0, 2, 3, 5, 7, 9, 11]);
scaleFamiliesDict.set("7major_harm",  [0, 2, 4, 5, 7, 8, 11]);
scaleFamiliesDict.set("7major_2harm", [0, 1, 4, 5, 7, 8, 11]);
scaleFamiliesDict.set("7major_neap",  [0, 1, 3, 5, 7, 9, 11]);
scaleFamiliesDict.set("7minor_neap",  [0, 1, 3, 5, 7, 8, 11]);
scaleFamiliesDict.set("7major_hung",  [0, 3, 4, 6, 7, 9, 10]);
scaleFamiliesDict.set("7persian",     [0, 1, 4, 5, 6, 8, 11]);
scaleFamiliesDict.set("7verdi_enigm", [0, 1, 4, 6, 8, 10, 11]);
scaleFamiliesDict.set("7theta_purvi", [0, 1, 4, 6, 7, 8, 11]);

// 6 notes
scaleFamiliesDict.set("6blues",        [0, 3, 5, 6, 7, 10]);
scaleFamiliesDict.set("6strange",      [0, 2, 4, 6, 8, 10]);
scaleFamiliesDict.set("6major_hexa",   [0, 2, 4, 5, 7, 9]);
scaleFamiliesDict.set("6aug",          [0, 3, 4, 7, 8, 11]);
scaleFamiliesDict.set("6prom",         [0, 2, 4, 6, 9, 10]);
scaleFamiliesDict.set("6prom_nap",     [0, 1, 4, 6, 9, 10]);
scaleFamiliesDict.set("6tritone",      [0, 1, 4, 6, 7, 10]);
scaleFamiliesDict.set("6tritone_semi", [0, 1, 2, 6, 7, 8]);
scaleFamiliesDict.set("6istrian",      [0, 1, 3, 4, 6, 7]);

// 5 notes
scaleFamiliesDict.set("5major_penta",     [0, 2, 4, 7, 9]);
scaleFamiliesDict.set("5javanese",        [0, 4, 5, 7, 11]);
scaleFamiliesDict.set("5pelog_bem",       [0, 1, 6, 7, 8]);
scaleFamiliesDict.set("5pelog_barang",    [0, 2, 6, 7, 9]);
scaleFamiliesDict.set("5jap_in",          [0, 1, 5, 7, 8]);
scaleFamiliesDict.set("5jap_insen",       [0, 1, 5, 7, 10]);
scaleFamiliesDict.set("5dom_penta",       [0, 2, 4, 7, 10]);
scaleFamiliesDict.set("5bartok_penta",    [0, 4, 6, 7, 10]);
scaleFamiliesDict.set("5phryg6_penta",    [0, 1, 3, 7, 9]);
scaleFamiliesDict.set("5blues_no4_penta", [0, 3, 6, 7, 10]);

// chromatic
scaleFamiliesDict.set("12tet", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);


//////////////////////////////////// STRINGS //////////////////////////////////

// international

const scalesDict_int: Map<string, string> = new Map<string, string>();

scalesDict_int.set("12tet,1", "Chromatic");

scalesDict_int.set("7notes", "------------------------ 7 NOTES ------------------------");

scalesDict_int.set("7major_nat,1", "Natural major / Ionian");
scalesDict_int.set("7major_nat,6,diff:7major_nat;1", "Natural minor / Aeolian (6th mode)");
scalesDict_int.set("7major_nat,2,diff:7major_nat;6", "Dorian (2nd mode)");
scalesDict_int.set("7major_nat,3,diff:7major_nat;6", "Phrygian (3rd mode)");
scalesDict_int.set("7major_nat,4,diff:7major_nat;1", "Lydian (4th mode)");
scalesDict_int.set("7major_nat,5,diff:7major_nat;1", "Mixolydian (5th mode)");
scalesDict_int.set("7major_nat,7,diff:7major_nat;6", "Locrian (7th mode)");
scalesDict_int.set("7major_nat,sep", "");
scalesDict_int.set("7minor_harm,1,diff:7major_nat;6", "Harmonic minor");
scalesDict_int.set("7minor_harm,2,diff:7major_nat;7", "Locrian ♮6 (2nd mode)");
scalesDict_int.set("7minor_harm,3,diff:7major_nat;1", "Ionian augmented / Ionian #5 (3rd mode)");
scalesDict_int.set("7minor_harm,4,diff:7major_nat;2", "Romanian minor / Ukrainian Dorian (4th mode)");
scalesDict_int.set("7minor_harm,5,diff:7major_nat;3", "Phrygian dominant / Freygish (5th mode)");
scalesDict_int.set("7minor_harm,6,diff:7major_nat;4", "Lydian #2 (6th mode)");
scalesDict_int.set("7minor_harm,7,diff:7major_nat;7", "Ultra Locrian / Altered ♭♭7 (7th mode)");
scalesDict_int.set("7minor_harm,sep", "");
scalesDict_int.set("7minor_melo,1,diff:7major_nat;6", "Melodic minor");
scalesDict_int.set("7minor_melo,2,diff:7major_nat;6", "Dorian ♭2 / Phrygian ♮6 (2nd mode)");
scalesDict_int.set("7minor_melo,3,diff:7major_nat;4", "Lydian augmented / Lydian #5 (3rd mode)");
scalesDict_int.set("7minor_melo,4,diff:7major_nat;4", "Bartok / Lydian Dominant (4th mode)");
scalesDict_int.set("7minor_melo,5,diff:7major_nat;5", "Hindu / Mixolydian ♭6 (5th mode)");
scalesDict_int.set("7minor_melo,6,diff:7major_nat;7", "Half-diminished / Locrian ♮2 (6th mode)");
scalesDict_int.set("7minor_melo,7,diff:7major_nat;7", "Super Locrian / Altered (7th mode)");
scalesDict_int.set("7minor_melo,sep", "");
scalesDict_int.set("7major_2harm,1,diff:7major_nat;1", "Double harm. major / Byzantine / Gypsy");
scalesDict_int.set("7major_2harm,2,diff:7major_nat;4", "Lydian #2 #6 (2nd mode)");
scalesDict_int.set("7major_2harm,3,diff:7major_nat;3", "Ultra phrygian (3rd mode)");
scalesDict_int.set("7major_2harm,4,diff:7major_nat;6", "Hungarian minor (4th mode)");
scalesDict_int.set("7major_2harm,5", "Oriental / Asian (5th mode)");
scalesDict_int.set("7major_2harm,6,diff:7major_nat;1", "Ionian augmented #2 (6th mode)");
scalesDict_int.set("7major_2harm,7,diff:7major_nat;7", "Locrian ♭♭3 ♭♭7 (7th mode)");
scalesDict_int.set("7major_2harm,sep", "");
scalesDict_int.set("7major_harm,1,diff:7major_nat;1", "Harmonic major / Ionian ♭6");
scalesDict_int.set("7major_harm,2,diff:7major_nat;2", "Nahawand Murassa' / Dorian ♭5 (2nd mode)");
scalesDict_int.set("7major_harm,3,diff:7major_nat;3", "Phrygian ♭4 (3rd mode)");
scalesDict_int.set("7major_harm,4,diff:7major_nat;4", "Lydian ♭3 / Melodic minor #4 (4th mode)");
scalesDict_int.set("7major_harm,5,diff:7major_nat;5", "Zanjaran / Mixolydian ♭2 (5th mode)");
scalesDict_int.set("7major_harm,6,diff:7major_nat;4", "Lydian augmented #2 (6th mode)");
scalesDict_int.set("7major_harm,7,diff:7major_nat;7", "Locrian ♭♭7 (7th mode)");
scalesDict_int.set("7major_harm,sep", "");
scalesDict_int.set("7major_neap,1,diff:7minor_melo;1", "Neapolitan major");
scalesDict_int.set("7major_neap,2", "Leading whole tone (2nd mode)");
scalesDict_int.set("7major_neap,4,diff:7major_nat;4", "Lydian minor (4th mode)");
scalesDict_int.set("7major_neap,5,diff:7major_nat;7", "Arabian / Locrian major (5th mode)");
scalesDict_int.set("7major_neap,sep", "");
scalesDict_int.set("7minor_neap,1,diff:7major_nat;6", "Neapolitan minor");
scalesDict_int.set("7minor_neap,2,diff:7major_nat;4", "Lydian #6 (2nd mode)");
scalesDict_int.set("7minor_neap,4", "Hungarian gypsy (4th mode)");
scalesDict_int.set("7minor_neap,sep", "");
scalesDict_int.set("7persian,1,diff:7major_2harm;1", "Persian");
scalesDict_int.set("7persian,4", "Todi theta (4th mode)");
scalesDict_int.set("7persian,sep", "");
scalesDict_int.set("7major_hung,1", "Hungarian major");
scalesDict_int.set("7verdi_enigm,1", "Verdi's Enigmatica");
scalesDict_int.set("7theta_purvi,1,diff:7major_2harm;1", "Purvi theta / Kamavardhani");
scalesDict_int.set("7others,sep", "");

scalesDict_int.set("8notes", "------------------------ 8 NOTES ------------------------");

scalesDict_int.set("8bebop_dom,1,diff:7major_nat;1", "Bebop dominant");
scalesDict_int.set("8bebop_dom,4", "Ichikosucho (4th mode)");
scalesDict_int.set("8bebop_dom,5,diff:7major_nat;2", "Bebop Dorian / Bebop minor (5th mode)");
scalesDict_int.set("8bebop_dom,sep", "");
scalesDict_int.set("8bebop_maj,1,diff:7major_nat;1", "Bebop major");
scalesDict_int.set("8bebop_maj,7,diff:7minor_harm;1", "Bebop harmonic minor (7th mode)");
scalesDict_int.set("8bebop_maj,sep", "");
scalesDict_int.set("8bebop_min_melo,1,diff:7minor_melo;1", "Bebop melodic minor");
scalesDict_int.set("8bebop_min_melo,sep", "");
scalesDict_int.set("8spanish,1", "Spanish");
scalesDict_int.set("8spanish,sep", "");
scalesDict_int.set("8dim,1", "Diminished");
scalesDict_int.set("8dim,2", "Dominant diminished / Dom-dim (2nd mode)");
scalesDict_int.set("8others,sep", "");

scalesDict_int.set("6notes", "------------------------ 6 NOTES ------------------------");
scalesDict_int.set("6blues,1,diff:5major_penta;5", "Blues / Penta. minor + blue note");
scalesDict_int.set("6strange,1", "Whole tone / Strange / Debussy");
scalesDict_int.set("6main,sep", "");
scalesDict_int.set("6aug,1", "Augmented / Irish / Scottish");
scalesDict_int.set("6aug,2", "Six-tone symmetrical (2nd mode)");
scalesDict_int.set("6aug,sep", "");
scalesDict_int.set("6major_hexa,1", "Hexatonic major");
scalesDict_int.set("6prom,1", "Prometheus / Mystic");
scalesDict_int.set("6prom_nap,1", "Prometheus neapolitan");
scalesDict_int.set("6tritone,1", "Tritone / Petrushka");
scalesDict_int.set("6tritone_semi,1", "Two-semitone tritone");
scalesDict_int.set("6istrian,1", "Istrian");
scalesDict_int.set("6others,sep", "");

scalesDict_int.set("5notes", "------------------------ 5 NOTES ------------------------");
scalesDict_int.set("5major_penta,1", "Pentatonic major / Mongolian");
scalesDict_int.set("5major_penta,5", "Pentatonic minor / Yo (5th mode)");
scalesDict_int.set("5major_penta,2", "Egyptian / Suspended (2nd mode)");
scalesDict_int.set("5major_penta,3", "Blues minor / Man gong (3rd mode)");
scalesDict_int.set("5major_penta,4", "Blues major / Ritsusen (4th mode)");
scalesDict_int.set("5major_penta,sep", "");
scalesDict_int.set("5jap_in,1", "In / Miyako-Bushi");
scalesDict_int.set("5jap_in,2", "Chinese (2nd mode)");
scalesDict_int.set("5jap_in,3", "Hirajoshi (3rd mode)");
scalesDict_int.set("5jap_in,4", "Iwato (4th mode)");
scalesDict_int.set("5jap_in,sep", "");
scalesDict_int.set("5jap_insen,1", "Insen");
scalesDict_int.set("5jap_insen,5", "Kumoi (5th mode)");
scalesDict_int.set("5jap_insen,sep", "");
scalesDict_int.set("5javanese,1", "Javanese / Ryu Kyu");
scalesDict_int.set("5javanese,2", "Balinese (2nd mode)");
scalesDict_int.set("5javanese,5", "Iwato bis (5th mode)");
scalesDict_int.set("5javanese_sep", "");
scalesDict_int.set("5pelog_barang,1", "Pelog Barang");
scalesDict_int.set("5pelog_barang,2", "Mixolydian Pentatonic (2nd mode)");
scalesDict_int.set("5pelog_barang_sep", "");
scalesDict_int.set("5pelog_bem,1", "Pelog Bem");
scalesDict_int.set("5pelog_bem_sep", "");
scalesDict_int.set("5dom_penta,1,diff:5major_penta;1", "Dominant Pentatonic");
scalesDict_int.set("5dom_penta,4,diff:5major_penta;5", "Dorian Pentatonic (4th mode)");
scalesDict_int.set("5dom_penta_sep", "");
scalesDict_int.set("5bartok_penta,1,diff:5major_penta;5", "Bartok Pentatonic");
scalesDict_int.set("5phryg6_penta,1,diff:5major_penta;1", "Phrygian Pentatonic ♮6");
scalesDict_int.set("5blues_no4_penta,1,diff:5major_penta;5", "Blues no4");
scalesDict_int.set("5others,sep", "");


/////////////////////////////////// FRENCH ////////////////////////////////////


const scalesDict_fr: Map<string, string> = new Map<string, string>();

scalesDict_fr.set("12tet,1", "Chromatique");

scalesDict_fr.set("7major_nat,1", "Majeur naturel / Ionien");
scalesDict_fr.set("7major_nat,6,diff:7major_nat;1", "Mineur naturel / Eolien (6e mode)");
scalesDict_fr.set("7major_nat,2,diff:7major_nat;6", "Dorien (2e mode)");
scalesDict_fr.set("7major_nat,3,diff:7major_nat;6", "Phrygien (3e mode)");
scalesDict_fr.set("7major_nat,4,diff:7major_nat;1", "Lydien (4e mode)");
scalesDict_fr.set("7major_nat,5,diff:7major_nat;1", "Mixolydien (5e mode)");
scalesDict_fr.set("7major_nat,7,diff:7major_nat;6", "Locrien (7e mode)");

scalesDict_fr.set("7minor_harm,1,diff:7major_nat;6", "Mineur harmonique");
scalesDict_fr.set("7minor_harm,2,diff:7major_nat;7", "Locrien ♮6 (2e mode)");
scalesDict_fr.set("7minor_harm,3,diff:7major_nat;1", "Ionien augmenté / Ionien #5 (3e mode)");
scalesDict_fr.set("7minor_harm,4,diff:7major_nat;2", "Roumain mineur / Dorien Ukrainien (4e mode)");
scalesDict_fr.set("7minor_harm,5,diff:7major_nat;3", "Phrygien dominant / Phrygien majeur (5e mode)");
scalesDict_fr.set("7minor_harm,6,diff:7major_nat;4", "Lydien #2 (6e mode)");
scalesDict_fr.set("7minor_harm,7,diff:7major_nat;7", "Ultra Locrien / Altérée ♭♭7 (7e mode)");

scalesDict_fr.set("7minor_melo,1,diff:7major_nat;6", "Mineur mélodique");
scalesDict_fr.set("7minor_melo,2,diff:7major_nat;6", "Dorien ♭2 / Phrygien ♮6 (2e mode)");
scalesDict_fr.set("7minor_melo,3,diff:7major_nat;4", "Lydien augmenté / Lydien #5 (3e mode)");
scalesDict_fr.set("7minor_melo,4,diff:7major_nat;4", "Bartok / Lydien Dominant (4e mode)");
scalesDict_fr.set("7minor_melo,5,diff:7major_nat;5", "Hindou / Mixolydien ♭6 (5e mode)");
scalesDict_fr.set("7minor_melo,6,diff:7major_nat;7", "Semi-diminué / Locrien ♮2 (6e mode)");
scalesDict_fr.set("7minor_melo,7,diff:7major_nat;7", "Super Locrien / Altérée (7e mode)");

scalesDict_fr.set("7major_2harm,1,diff:7major_nat;1", "Double majeur harm. / Byzantin / Gitan");
scalesDict_fr.set("7major_2harm,2,diff:7major_nat;4", "Lydien #2 #6 (2e mode)");
scalesDict_fr.set("7major_2harm,3,diff:7major_nat;3", "Ultra phrygien (3e mode)");
scalesDict_fr.set("7major_2harm,4,diff:7major_nat;6", "Hongrois mineur (4e mode)");
scalesDict_fr.set("7major_2harm,5", "Oriental / Asiatique (5e mode)");
scalesDict_fr.set("7major_2harm,6,diff:7major_nat;1", "Ionien augmenté #2 (6e mode)");
scalesDict_fr.set("7major_2harm,7,diff:7major_nat;7", "Locrien ♭♭3 ♭♭7 (7e mode)");

scalesDict_fr.set("7major_harm,1,diff:7major_nat;1", "Majeur harmonique / Ionien ♭6");
scalesDict_fr.set("7major_harm,2,diff:7major_nat;2", "Nahawand Murassa' / Dorien ♭5 (2e mode)");
scalesDict_fr.set("7major_harm,3,diff:7major_nat;3", "Phrygien ♭4 (3e mode)");
scalesDict_fr.set("7major_harm,4,diff:7major_nat;4", "Lydien ♭3 / Mineure mélodique #4 (4e mode)");
scalesDict_fr.set("7major_harm,5,diff:7major_nat;5", "Zanjaran / Mixolydien ♭2 (5e mode)");
scalesDict_fr.set("7major_harm,6,diff:7major_nat;4", "Lydien augmenté #2 (6e mode)");
scalesDict_fr.set("7major_harm,7,diff:7major_nat;7", "Locrien ♭♭7 (7e mode)");

scalesDict_fr.set("7major_neap,1,diff:7minor_melo;1", "Napolitain majeur");
scalesDict_fr.set("7major_neap,2", "Tons en tête (2e mode)");
scalesDict_fr.set("7major_neap,4,diff:7major_nat;4", "Lydien mineur (4e mode)");
scalesDict_fr.set("7major_neap,5,diff:7major_nat;7", "Arabe / Locrien majeur (5e mode)");

scalesDict_fr.set("7minor_neap,1,diff:7major_nat;6", "Napolitain mineur");
scalesDict_fr.set("7minor_neap,2,diff:7major_nat;4", "Lydien #6 (2e mode)");
scalesDict_fr.set("7minor_neap,4", "Hongrois gitan (4e mode)");

scalesDict_fr.set("7persian,1,diff:7major_2harm;1", "Persan");
scalesDict_fr.set("7persian,4", "Todi theta (4e mode)");

scalesDict_fr.set("7major_hung,1", "Hongrois majeur");
scalesDict_fr.set("7verdi_enigm,1", "Enigmatique de Verdi");

scalesDict_fr.set("8bebop_dom,1,diff:7major_nat;1", "Bebop dominant");
scalesDict_fr.set("8bebop_dom,5,diff:7major_nat;2", "Bebop dorien / Bebop mineur (5e mode)");

scalesDict_fr.set("8bebop_maj,1,diff:7major_nat;1", "Bebop majeur");
scalesDict_fr.set("8bebop_maj,7,diff:7minor_harm;1", "Bebop mineur harmonique (7e mode)");

scalesDict_fr.set("8bebop_min_melo,1,diff:7minor_melo;1", "Bebop mineur mélodique");

scalesDict_fr.set("8spanish,1", "Espagnole");

scalesDict_fr.set("8dim,1", "Diminué");
scalesDict_fr.set("8dim,2", "Dominant diminué / Dom-dim (2e mode)");

scalesDict_fr.set("6blues,1,diff:5major_penta;5", "Blues / Penta. mineur + blue note");
scalesDict_fr.set("6strange,1", "Tons / Etrange / Debussy");

scalesDict_fr.set("6aug,1", "Augmenté / Irlandais / Ecossais");
scalesDict_fr.set("6aug,2", "6 tons symétrique (2e mode)");

scalesDict_fr.set("6major_hexa,1", "Hexatonique majeur");
scalesDict_fr.set("6prom,1", "Prométhée / Mystique");
scalesDict_fr.set("6prom_nap,1", "Prométhée napolitain");
scalesDict_fr.set("6tritone,1", "Triton / Petrouchka");
scalesDict_fr.set("6tritone_semi,1", "2 semi-tons triton");
scalesDict_fr.set("6istrian,1", "Istrien");

scalesDict_fr.set("5major_penta,1", "Pentatonique majeur / Mongolien");
scalesDict_fr.set("5major_penta,5", "Pentatonique mineur / Yo (5e mode)");
scalesDict_fr.set("5major_penta,2", "Egyptien / Suspendu (2e mode)");
scalesDict_fr.set("5major_penta,3", "Blues mineur / Man gong (3e mode)");
scalesDict_fr.set("5major_penta,4", "Blues majeur / Ritsusen (4e mode)");

scalesDict_fr.set("5jap_in,1", "In / Miyako-Bushi");
scalesDict_fr.set("5jap_in,2", "Chinois (2e mode)");
scalesDict_fr.set("5jap_in,3", "Hirajoshi (3e mode)");
scalesDict_fr.set("5jap_in,4", "Iwato (4e mode)");

scalesDict_fr.set("5jap_insen,1", "Insen");
scalesDict_fr.set("5jap_insen,5", "Kumoi (5e mode)");

scalesDict_fr.set("5javanese,1", "Javanais / Ryu Kyu");
scalesDict_fr.set("5javanese,2", "Balinais (2e mode)");
scalesDict_fr.set("5javanese,5", "Iwato bis (5e mode)");

scalesDict_fr.set("5pelog_barang,2", "Pentatonique Mixolydien (2e mode)");

scalesDict_fr.set("5dom_penta,1,diff:5major_penta;1", "Pentatonique Dominante");
scalesDict_fr.set("5dom_penta,4,diff:5major_penta;5", "Pentatonique Dorienne (4e mode)");
scalesDict_fr.set("5bartok_penta,1,diff:5major_penta;5", "Pentatonique Bartok");
scalesDict_fr.set("5phryg6_penta,1,diff:5major_penta;1", "Pentatonique Phrygien ♮6");


// global dictionary
const scalesDicts: Map<string, Map<string, string>> = new Map<string,Map<string, string>>();
scalesDicts.set("int", scalesDict_int);
scalesDicts.set("fr",  scalesDict_fr);


/////////////////////////////////// FUNCTIONS /////////////////////////////////

const scalesToHighlight: Array<string> = ["12tet,1",
    "7major_nat,1", "7major_nat,6", "7minor_harm,1", "7minor_melo,1",
    "7major_2harm,1", "7major_harm,1", "7major_neap,1", "7minor_neap,1", "7persian,1",
    "7bayati,1", "7hardino,1", "7hijaz,1", "7rast,1", "7mahur", "7mustaar", "7saba", "7sikah_baladi,1",
    "8bebop_dom,1", "8bebop_maj,1", "8dim,1",
    "6blues,1", "6strange,1", "6aug,1",
    "5major_penta,1", "5major_penta,5", "5jap_in,1", "5jap_insen,1", "5javanese,1", "5pelog_barang,1", "5dom_penta,1"
];

function hightlightScale(id: string): boolean
{
    if (scalesToHighlight.indexOf(id) != -1)
        return true;

    let found: boolean = false;
    scalesToHighlight.forEach(function (idScale, index)
    {
        if (id.startsWith(idScale))
            found = true;
    });

    return found;
}

// update scale selector
function updateScaleSelector(id: string, defaultScaleId: string, includesQTones = true, includesExtraScales = false): void
{
    const scaleSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(id);
    const initialized: boolean = (scaleSelect.options != null && scaleSelect.options.length > 0);
    const regexNbNotes = /(\d+)notes/;
 
    const scaleParamValue = parseParameterById("scale");
    if (scaleParamValue != "")
      defaultScaleId = scaleParamValue;
  
    if (!initialized)
    {
        // init
        for (const [key , value] of scalesDict_int)
        {
            if (!includesQTones && key.includes("quarter_tones"))
                break;

            if (!includesExtraScales && key.startsWith("12tet"))
                continue;
            if (!includesExtraScales && key.includes("xenharmonics"))
                break;
            
            const scaleName = getScaleString(key);
            let option = document.createElement('option');
            option.value = key;
            option.innerHTML = scaleName;
            
            // scale to highlight
            if (hightlightScale(key))
                option.classList.add('bolden');
    
            // notes seperator
            if (key.match(regexNbNotes) || key.includes("xenharmonics"))
            {
                option.classList.add('bolden');
                option.disabled = true;
            }
    
            // simple separator
            if (scaleName == "")
                option.disabled = true;
    
            // default scale
            if (key == defaultScaleId)
                option.selected = true;
    
            scaleSelect.appendChild(option);
        }
    }
    else
    {
        // update
        let scaleValue = 0;
        for (const [key , value] of scalesDict_int)
        {
            if (!includesQTones && key.includes("quarter_tones"))
                break;
            
            if (!includesExtraScales && key.startsWith("12tet"))
                continue;
            if (!includesExtraScales && key.includes("xenharmonics"))
                break;
            
            scaleSelect.options[scaleValue].innerHTML = getScaleString(key);
            scaleValue++;
        }
    }
}

// get scale notes values given tonic and scale
function getScaleNotesValues(noteValue: number, scaleValues: Array<number>): Array<number>
{
  let scaleNotesValues: Array<number> = new Array<number>();

  scaleValues.forEach(function (interval, index)
  {
    const newNoteValue: number = addToNoteValue(noteValue, interval);
    scaleNotesValues.push(newNoteValue);
  });

  return scaleNotesValues;
}

function isMicrotonalScale(notesValues: Array<number>): boolean
{
    for (const noteValue of notesValues)
    {
        if (isMicrotonalInterval(noteValue))
            return true;
    }

    return false;
}