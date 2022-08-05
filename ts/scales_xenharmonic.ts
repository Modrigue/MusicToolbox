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
//scaleFamiliesDict.set("12ji_lmy_piano",        [0, 1.77, 2.04, 2.40, 4.44, 4.71, 6.75, 7.02, 7.38, 9.42, 9.69, 11.73]);
scaleFamiliesDict.set("12ji_kg_centaur",       [0, 0.8467 , 2.03910, 2.66871, 3.86314, 4.98045, 5.82512, 7.01955, 7.64916, 8.84359, 9.68826, 10.88269]);
scaleFamiliesDict.set("12ji_kg_centaura_sub",  [0, 1.19443, 1.82404, 3.33041, 3.86314, 4.98045, 6.17488, 7.01955, 8.21398, 8.84359, 10.34996, 10.88269]);
scaleFamiliesDict.set("12ji_kg_centaura_harm", [0, 0.53273, 2.03910, 2.66871, 3.86314, 4.98045, 5.51318, 7.01955, 7.64916, 8.84359, 9.68826, 10.88269]);
scaleFamiliesDict.set("12ji_wc_sj",            [0, 1.04955, 2.03910, 3.15641, 3.86314, 4.98045, 5.51318, 7.01955, 8.40528, 8.84359, 9.68826, 10.88269]);

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

scaleFamiliesDict.set("7tetrachordal", [0, 1.82404, 3.47408, 4.98045, 7.01955, 8.84359, 10.49363]);


//////////////////////////////////// STRINGS //////////////////////////////////


// international

scalesDict_int.set("5notes_quarter_tones", "--------------- 5 NOTES ¼ TONES ---------------");

scalesDict_int.set("5tet_approx,1,diff:5major_penta;4", "5-TET / 5-EDO (Approximation)");
scalesDict_int.set("5notes_quarter_tones,sep", "");

scalesDict_int.set("xenharmonics", "----------------- XENHARMONICS ----------------");
for (const nbNotes of xenTETScalesNbNotes)
    scalesDict_int.set(`${nbNotes}tet,1`, `${nbNotes}-TET / ${nbNotes}-EDO`);
scalesDict_int.set("5xen_tet,sep", "");

scalesDict_int.set("7ji_major,1", "Just intonation major");
scalesDict_int.set("7ji_minor,1", "Just intonation minor");
scalesDict_int.set("7ji_indian,1", "Just intonation indian");
//scalesDict_int.set("12ji_lmy_piano,1", "La Monte Young Well-Tuned Piano");
scalesDict_int.set("12ji_kg_centaur,1", "Kraig Grady Centaur");
scalesDict_int.set("12ji_kg_centaura_harm,1", "Kraig Grady Centaura harmonic");
scalesDict_int.set("12ji_kg_centaura_sub,1", "Kraig Grady Centaura subharmonic");
scalesDict_int.set("12ji_wc_sj,1", "Wendy Carlos Super Just");
scalesDict_int.set("ji,sep", "");

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
scalesDict_int.set("edo_subsets,sep", "");

scalesDict_int.set("7tetrachordal,1", "Tetrachordal[7]");


/////////////////////////////////// FRENCH ////////////////////////////////////


scalesDict_fr.set("xenharmonics", "-------------- XENHARMONIQUES --------------");

scalesDict_fr.set("7ji_major,1", "Juste intonation majeure");
scalesDict_fr.set("7ji_minor,1", "Juste intonation mineure");
scalesDict_fr.set("7ji_indian,1", "Juste intonation indienne");