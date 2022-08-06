// xenharmonics

// equal-temperament scales
const xenTETScalesNbNotes = [5, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 22, 23, 24];
for (const nbNotes of xenTETScalesNbNotes)
{
    let scaleValuesXenCur: Array<number> = [];
    for (let i = 0; i < nbNotes; i++)
        scaleValuesXenCur.push(i * 12 / nbNotes);
    
    scaleFamiliesDict.set(`${nbNotes}tet`, scaleValuesXenCur);
}

// sources:
//  https://en.wikipedia.org/wiki/Just_intonation
//  https://www.kylegann.com/wtp.html
//  https://sevish.com/scaleworkshop
//  https://en.xen.wiki/
//  https://en.xen.wiki/w/Category:Pages_with_Scala_files

// just intonation scales
scaleFamiliesDict.set("7ji_major",             [0, 2.04, 3.86, 4.98, 7.02, 8.84, 10.88]);
scaleFamiliesDict.set("7ji_minor",             [0, 2.04, 3.16, 4.98, 7.02, 8.14, 10.18]);
scaleFamiliesDict.set("7ji_indian",            [0, 2.04, 3.86, 4.98, 7.02, 9.06, 10.88]);
scaleFamiliesDict.set("12ji_kg_centaur",       [0, 0.8467 , 2.03910, 2.66871, 3.86314, 4.98045, 5.82512, 7.01955, 7.64916, 8.84359, 9.68826, 10.88269]);
scaleFamiliesDict.set("12ji_kg_centaura_sub",  [0, 1.19443, 1.82404, 3.33041, 3.86314, 4.98045, 6.17488, 7.01955, 8.21398, 8.84359, 10.34996, 10.88269]);
scaleFamiliesDict.set("12ji_kg_centaura_harm", [0, 0.53273, 2.03910, 2.66871, 3.86314, 4.98045, 5.51318, 7.01955, 7.64916, 8.84359, 9.68826, 10.88269]);
scaleFamiliesDict.set("12ji_pythagorean",      [0, 0.90225, 2.03910, 2.94135, 4.07820, 4.98045, 5.88270, 7.01955, 7.92180, 9.05865, 9.96090, 10.86315]);
scaleFamiliesDict.set("12ji_wendy_carlos_sj",  [0, 1.04955, 2.03910, 3.15641, 3.86314, 4.98045, 5.51318, 7.01955, 8.40528, 8.84359, 9.68826, 10.88269]);
scaleFamiliesDict.set("12ji_werckmeister_3",   [0, 1.0782, 2.0391, 3.1172, 4.0196, 5.0391, 6.0587, 7.0196, 8.0978, 9.0000, 10.0782, 11.0391]);
scaleFamiliesDict.set("12ji_young_1799",       [0, 1.060, 1.980, 3.062, 4.001, 5.020, 6.040, 6.979, 8.061, 8.981, 10.041, 11.020]);

// traditionnal
scaleFamiliesDict.set("22shruti",        [0, 0.90225, 1.11731, 1.82404, 2.03910, 2.94135, 3.15641, 3.86314, 4.07820, 4.98045, 5.19551, 5.90224, 6.11730, 7.01955, 7.92180, 8.13686, 8.84359, 9.05865, 9.96090, 10.17596, 10.88269, 11.09775]);
scaleFamiliesDict.set("7archytas_dia",   [0, 0.62961, 2.94135, 4.98045, 7.01955, 7.64916, 9.96090]);
scaleFamiliesDict.set("7archytas_enh",   [0, 0.62961, 1.11731, 4.98045, 7.01955, 7.64916, 8.13686]);
scaleFamiliesDict.set("7balafon1",       [1.87, 3.56, 5.26, 6.72, 8.56, 9.85, 12.22]);
scaleFamiliesDict.set("7balafon2",       [0, 1.52, 2.87, 5.33, 7.24, 8.90, 10.29]);
scaleFamiliesDict.set("7balafon3",       [1.95, 2.89, 5.13, 6.86, 7.96, 10.08, 12.09]);
scaleFamiliesDict.set("7balafon4",       [1.51, 3.45, 5.26, 6.60, 8.61, 10.25, 11.41]);
scaleFamiliesDict.set("7balafon5",       [1.69, 3.50, 5.43, 7.09, 8.94, 10.40, 12.05]);
scaleFamiliesDict.set("7balafon6",       [1.14, 3.50, 5.50, 6.87, 8.38, 10.32, 11.96]);
scaleFamiliesDict.set("5balafon7",       [0, 2.02, 3.70, 6.85, 9.03]);
scaleFamiliesDict.set("7didymus",        [0, 1.11731, 1.82404, 4.98045, 7.01955, 8.13686, 8.84359]);
scaleFamiliesDict.set("5hirajoshi_trad", [0, 1.85, 3.37, 6.83, 7.90]);
scaleFamiliesDict.set("7pelog_norm",     [1.20, 2.70, 5.40, 6.70, 7.85, 9.50, 12.15]);
scaleFamiliesDict.set("7ptolemy_di",     [0, 0.90225, 2.94135, 4.98045, 7.01955, 7.92180, 9.96090]);
scaleFamiliesDict.set("7ptolemy_he",     [0, 1.50637, 3.15641, 4.98045, 7.01955, 8.52592, 10.17596]);
scaleFamiliesDict.set("7raga_bageshri",  [0, 1.82404, 2.94135, 4.98045, 7.01955, 8.84359, 9.96090]);
scaleFamiliesDict.set("8raga_bhairavi",  [0, 1.11731, 2.03910, 3.15641, 5.19551, 7.01955, 8.13686, 10.17596]);
scaleFamiliesDict.set("7raga_kafi",      [0, 2.03910, 2.94135, 4.98045, 7.01955, 8.84359, 9.96090]);
scaleFamiliesDict.set("7raga_todi",      [0, 0.90225, 2.94135, 5.90224, 7.01955, 7.92180, 10.88269]);
scaleFamiliesDict.set("7raga_yaman",     [0, 2.03910, 3.86314, 5.90224, 7.01955, 9.05865, 10.88269]);
scaleFamiliesDict.set("5slendro",        [2.31, 4.74, 7.17, 9.55, 12.08]);

// equal temperament subsets
scaleFamiliesDict.set("11edo_machine_6",     [0, 2.18182, 4.36364, 6.54545, 8.72727, 10.90909]);
scaleFamiliesDict.set("13edo_glacial_7",     [0, 1.8573, 3.7146, 5.5718, 7.4291, 9.2864, 11.1437]);
scaleFamiliesDict.set("13edo_father_8",      [0, 1.84615, 3.69231, 4.61538, 6.46154, 8.30769, 9.23077, 11.07692]);
scaleFamiliesDict.set("15edo_blackwood_10",  [0, 1.6, 2.4, 4.0, 4.8, 6.4, 7.2, 8.8, 9.6, 11.2]);
scaleFamiliesDict.set("16edo_mavila_7",      [0, 1.50, 3.00, 5.25, 6.75, 8.25, 9.75]);
scaleFamiliesDict.set("17edo_superpyth_12",  [0, 0.70588, 1.41176, 2.82353, 3.52941, 4.94118, 5.64706, 6.35294, 7.76471, 8.47059, 9.88235, 10.58824]);
scaleFamiliesDict.set("17edo_rast",          [0, 2.11765, 3.52941, 4.94118, 7.05882, 9.17647, 10.58824]);
scaleFamiliesDict.set("22edo_ganymede_10",   [0, 1.50637, 2.89210, 4.17508, 5.93718, 7.01955, 8.03822, 9.46195, 9.91165, 10.77744]);
scaleFamiliesDict.set("22edo_porcupine_8",   [0, 1.63636, 3.27273, 4.90909, 6.54545, 8.18182, 9.81818, 11.45455]);
scaleFamiliesDict.set("22edo_orwell_9",      [0, 1.09091, 2.72727, 3.81818, 5.45455, 6.54545, 8.18182, 9.27273, 10.90909]);
scaleFamiliesDict.set("22edo_pajara_12",     [0, 1.09091, 2.18182, 3.27273, 4.36364, 5.45455, 6.00000, 7.09091, 8.18182, 9.27273, 10.36364, 11.45455]);
scaleFamiliesDict.set("26edo_lemba_10",      [0, 1.38462, 2.30769, 3.69231, 4.61538, 6.00000, 7.38462, 8.30769, 9.69231, 10.61538]);
scaleFamiliesDict.set("26edo_flattone_12",   [0, 0.46154, 1.84615, 2.30769, 3.69231, 5.07692, 5.53846, 6.92308, 7.38462, 8.76923, 9.23077, 10.61538]);
scaleFamiliesDict.set("31edo_meantone_19",   [0, 0.38710, 1.16129, 1.54839, 2.32258, 3.09677, 3.48387, 4.25806, 5.03226, 5.41935, 6.19355, 6.58065, 7.35484, 8.12903, 8.51613, 9.29032, 10.06452, 10.45161, 11.22581]);
scaleFamiliesDict.set("46edo_sensi_11",      [0, 1.30435, 2.60870, 3.91304, 4.43478, 5.73913, 7.04348, 8.34783, 8.86957, 10.17391, 11.47826]);
scaleFamiliesDict.set("128edo_approx_22",    [0, 0.53273, 1.04955, 1.67462, 2.15891, 2.74582, 3.31349, 3.86314, 4.39587, 4.91269, 5.41453, 5.99815, 6.56273, 7.10948, 7.63950, 8.15376, 8.73505, 9.29744, 9.84215, 10.37023, 10.88269, 11.45036]);
scaleFamiliesDict.set("313edo_island_9",     [0, 2.03195, 2.49201, 4.52396, 4.98403, 7.01597, 7.47604, 9.50799, 9.96805]);

// misc
scaleFamiliesDict.set("6hexany1379",    [0, 2.03910, 2.66871, 4.70781, 7.01955, 9.68826]);
scaleFamiliesDict.set("7tetrachordal",  [0, 1.82404, 3.47408, 4.98045, 7.01955, 8.84359, 10.49363]);
scaleFamiliesDict.set("11semaphore",    [0, 0.7954, 1.7637, 2.5591, 4.3228, 5.1182, 6.8818, 6.8818, 7.6773, 9.4409, 10.2364, 11.2046]);
scaleFamiliesDict.set("17supermariner", [0, 0.45258, 1.76639, 2.21897, 2.67155, 3.12412, 4.43794, 4.89052, 5.34309, 6.65691, 7.10948, 7.56206, 8.87588, 9.32845, 9.78103, 10.23361, 11.54742]);

// non-octaves
//scaleFamiliesDict.set("golden_ratio", [1.2155, 1.9667, 3.1821, 4.3976, 5.1488, 6.3642, 7.1154, 8.3309]);
//scaleFamiliesDict.set("mersh", [0.86265, 2.17449, 4.10520, 5.89714, 6.83627]);


//////////////////////////////////// STRINGS //////////////////////////////////


// international

scalesDict_int.set("xenharmonics", "----------------- XENHARMONICS ----------------");
scalesDict_int.set("xen_title, sep", "");

scalesDict_int.set("xenharmonics_ji", "------------------ Just Intonation ------------------");

scalesDict_int.set("7ji_major,1", "Just intonation major");
scalesDict_int.set("7ji_minor,1", "Just intonation minor");
scalesDict_int.set("7ji_indian,1", "Just intonation indian");
scalesDict_int.set("12ji_kg_centaur,1", "Kraig Grady Centaur");
scalesDict_int.set("12ji_kg_centaura_harm,1", "Kraig Grady Centaura harmonic");
scalesDict_int.set("12ji_kg_centaura_sub,1", "Kraig Grady Centaura subharmonic");
scalesDict_int.set("12ji_pythagorean,1", "Pythagorean");
scalesDict_int.set("12ji_wendy_carlos_sj,1", "Wendy Carlos Super Just");
scalesDict_int.set("12ji_werckmeister_3,1", "Werckmeister III");
scalesDict_int.set("12ji_young_1799,1", "Young (1799)");
scalesDict_int.set("ji,sep", "");

scalesDict_int.set("xenharmonics_trad", "--------------------- Traditionnal --------------------");

scalesDict_int.set("22shruti,1", "22 Shruti");
scalesDict_int.set("7archytas_dia,1", "Archytas diatonic");
scalesDict_int.set("7archytas_enh,1", "Archytas enharmonic");
scalesDict_int.set("7balafon1,1", "Balafon 1 (Patna)");
scalesDict_int.set("7balafon2,1", "Balafon 2 (West-Africa)");
scalesDict_int.set("7balafon3,1", "Balafon 3 (Pitt-River)");
scalesDict_int.set("7balafon4,1", "Balafon 4 (Mandinka)");
scalesDict_int.set("7balafon5,1", "Balafon 5 (Singapore)");
scalesDict_int.set("7balafon6,1", "Balafon 6 (Burma)");
scalesDict_int.set("5balafon7,1", "Balafon 7 (South Pacific)");
scalesDict_int.set("7didymus,1", "Didymus chromatic");
scalesDict_int.set("5hirajoshi_trad,1", "Hirajoshi (trad.)");
scalesDict_int.set("7pelog_norm,1", "Pelog (normalized)");
scalesDict_int.set("7ptolemy_di,1", "Ptolemy diatonic ditoniaion");
scalesDict_int.set("7ptolemy_he,1", "Ptolemy diatonic hemiolion");
scalesDict_int.set("7raga_bageshri,1", "Raga Bageshri");
scalesDict_int.set("8raga_bhairavi,1", "Raga Bhairavi");
scalesDict_int.set("7raga_kafi,1", "Raga Kafi");
scalesDict_int.set("7raga_todi,1", "Raga Todi");
scalesDict_int.set("7raga_yaman,1", "Raga Yaman");
scalesDict_int.set("5slendro,1", "Slendro");
scalesDict_int.set("trad,sep", "");

scalesDict_int.set("xenharmonics_tet", "-------------- Equal temperaments -------------");

for (const nbNotes of xenTETScalesNbNotes)
    scalesDict_int.set(`${nbNotes}tet,1`, `${nbNotes}-TET / ${nbNotes}-EDO`);
scalesDict_int.set("xen_tet,sep", "");

scalesDict_int.set("xenharmonics_tet_sub", "------- Equal temperaments subsets ------");

scalesDict_int.set("11edo_machine_6,1", "11-EDO Machine[6]");
scalesDict_int.set("13edo_father_8,1", "13-EDO Father[8]");
scalesDict_int.set("13edo_glacial_7,1", "13-EDO Glacial[7]");
scalesDict_int.set("15edo_blackwood_10,1", "15-EDO Blackwood[10]");
scalesDict_int.set("16edo_mavila_7,1", "16-EDO Mavila[7]");
scalesDict_int.set("17edo_rast,1", "17-EDO Rast");
scalesDict_int.set("17edo_superpyth_12,1", "17-EDO SuperPyth[12]");
scalesDict_int.set("22edo_ganymede_10,1", "22-EDO Ganymede[10]");
scalesDict_int.set("22edo_orwell_9,1", "22-EDO Orwell[9]");
scalesDict_int.set("22edo_pajara_12,1", "22-EDO Pajara[12]");
scalesDict_int.set("22edo_porcupine_8,1", "22-EDO Porcupine[8]");
scalesDict_int.set("26edo_flattone_12,1", "26-EDO FlatTone[12]");
scalesDict_int.set("26edo_lemba_10,1", "26-EDO Lemba[10]");
scalesDict_int.set("31edo_meantone_19,1", "31-EDO MeanTone[19]");
scalesDict_int.set("46edo_sensi_11,1", "46-EDO Sensi[11]");
scalesDict_int.set("128edo_approx_22,1", "128-EDO Approx[22]");
scalesDict_int.set("313edo_island_9,1", "313-EDO Island / Madagascar / Barbados[9]");
scalesDict_int.set("xen_tet_subsets,sep", "");

scalesDict_int.set("xenharmonics_misc_sub", "------------------- Miscellaneous ------------------");

scalesDict_int.set("6hexany1379,1", "Hexany[6] 1-3-7-9");
scalesDict_int.set("7tetrachordal,1", "Tetrachordal[7]");
scalesDict_int.set("11semaphore,1", "Semaphore[11]");
scalesDict_int.set("17supermariner,1", "Supermariner[17]");
scalesDict_int.set("xen_misc,sep", "");

scalesDict_int.set("xenharmonics_no_sub", "------------------ Without octave -----------------");


/////////////////////////////////// FRENCH ////////////////////////////////////


scalesDict_fr.set("xenharmonics", "--------------- XENHARMONIQUES ---------------");

scalesDict_fr.set("xenharmonics_ji", "------------------- Intonation juste ------------------");

scalesDict_fr.set("7ji_major,1", "Juste intonation majeure");
scalesDict_fr.set("7ji_minor,1", "Juste intonation mineure");
scalesDict_fr.set("7ji_indian,1", "Juste intonation indienne");

scalesDict_fr.set("xenharmonics_trad", "------------------- Traditionnelles -------------------");

scalesDict_fr.set("7balafon2,1", "Balafon 2 (Afrique de l'Ouest)");
scalesDict_fr.set("7balafon3,1", "Balafon 3 (Rivière Pitt)");
scalesDict_fr.set("7balafon5,1", "Balafon 5 (Singapour)");
scalesDict_fr.set("5balafon7,1", "Balafon 7 (Pacifique Sud)");

scalesDict_fr.set("xenharmonics_tet", "------------- Tempéraments égaux --------------");

scalesDict_fr.set("xenharmonics_tet_sub", "------- Extraits tempéraments égaux ------");

scalesDict_fr.set("xenharmonics_misc_sub", "------------------------ Diverses ------------------------");

scalesDict_fr.set("xenharmonics_no_sub", "--------------------- Sans octave ---------------------");