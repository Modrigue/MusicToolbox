"use strict";
// xenharmonics
// equal-temperament scales
const xenTETScalesNbNotes = [5, 7, 9, 10, 11, 13, 14, 15, 16, 17, 19, 22, 23, 24, 26, 28, 29, 31];
for (const nbNotes of xenTETScalesNbNotes)
    scaleFamiliesDict.set(`${nbNotes}tet`, getEDOScaleValues(nbNotes));
// sources:
//  https://en.wikipedia.org/wiki/Just_intonation
//  https://www.kylegann.com/wtp.html
//  https://sevish.com/scaleworkshop
//  https://en.xen.wiki/
//  https://en.xen.wiki/w/Category:Pages_with_Scala_files
//  https://en.xen.wiki/w/List_of_Scala_files
// just intonation scales
scaleFamiliesDict.set("7ji_major", getRatiosScaleValues([0, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 15 / 8]));
scaleFamiliesDict.set("7ji_minor", getRatiosScaleValues([0, 9 / 8, 6 / 5, 4 / 3, 3 / 2, 8 / 5, 9 / 5]));
scaleFamiliesDict.set("7ji_indian", getRatiosScaleValues([0, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 27 / 16, 15 / 8]));
scaleFamiliesDict.set("43ji_harry_partch", getRatiosScaleValues([0, 81 / 80, 33 / 32, 21 / 20, 16 / 15, 12 / 11, 11 / 10, 10 / 9, 9 / 8, 8 / 7, 7 / 6,
    32 / 27, 6 / 5, 11 / 9, 5 / 4, 14 / 11, 9 / 7, 21 / 16, 4 / 3, 27 / 20, 11 / 8, 7 / 5, 10 / 7, 16 / 11, 40 / 27, 3 / 2, 32 / 21, 14 / 9, 11 / 7, 8 / 5, 18 / 11, 5 / 3,
    27 / 16, 12 / 7, 7 / 4, 16 / 9, 9 / 5, 20 / 11, 11 / 6, 15 / 8, 40 / 21, 64 / 33, 160 / 81]));
scaleFamiliesDict.set("12ji_kg_centaur", getRatiosScaleValues([0, 21 / 20, 9 / 8, 7 / 6, 5 / 4, 4 / 3, 7 / 5, 3 / 2, 14 / 9, 5 / 3, 7 / 4, 15 / 8]));
scaleFamiliesDict.set("12ji_kg_centaura_sub", getRatiosScaleValues([0, 15 / 14, 10 / 9, 40 / 33, 5 / 4, 4 / 3, 10 / 7, 3 / 2, 45 / 28, 5 / 3, 20 / 11, 15 / 8]));
scaleFamiliesDict.set("12ji_kg_centaura_harm", getRatiosScaleValues([0, 33 / 32, 9 / 8, 7 / 6, 5 / 4, 4 / 3, 11 / 8, 3 / 2, 14 / 9, 5 / 3, 7 / 4, 15 / 8]));
scaleFamiliesDict.set("12ji_pythagorean", getRatiosScaleValues([0, 256 / 243, 9 / 8, 32 / 27, 81 / 64, 4 / 3, 1024 / 729, 3 / 2, 128 / 81, 27 / 16, 16 / 9, 4096 / 2187]));
scaleFamiliesDict.set("12ji_wendy_carlos_sj", getRatiosScaleValues([0, 17 / 16, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 11 / 8, 3 / 2, 13 / 8, 5 / 3, 7 / 4, 15 / 8]));
scaleFamiliesDict.set("12ji_werckmeister_3", [0, 1.0782, 2.0391, 3.1172, 4.0196, 5.0391, 6.0587, 7.0196, 8.0978, 9.0000, 10.0782, 11.0391]);
scaleFamiliesDict.set("12ji_young_1799", [0, 1.060, 1.980, 3.062, 4.001, 5.020, 6.040, 6.979, 8.061, 8.981, 10.041, 11.020]);
scaleFamiliesDict.set("7ji_zarlino", [0, 2.03910, 3.86314, 4.98045, 7.01955, 8.84359, 10.88269]);
// traditionnal
scaleFamiliesDict.set("22shruti", [0, 0.90225, 1.11731, 1.82404, 2.03910, 2.94135, 3.15641, 3.86314, 4.07820, 4.98045, 5.19551, 5.90224, 6.11730, 7.01955, 7.92180, 8.13686, 8.84359, 9.05865, 9.96090, 10.17596, 10.88269, 11.09775]);
scaleFamiliesDict.set("7archytas_dia", [0, 0.62961, 2.94135, 4.98045, 7.01955, 7.64916, 9.96090]);
scaleFamiliesDict.set("7archytas_enh", [0, 0.62961, 1.11731, 4.98045, 7.01955, 7.64916, 8.13686]);
scaleFamiliesDict.set("7balafon1", [1.87, 3.56, 5.26, 6.72, 8.56, 9.85, 12.22]);
scaleFamiliesDict.set("7balafon2", [0, 1.52, 2.87, 5.33, 7.24, 8.90, 10.29]);
scaleFamiliesDict.set("7balafon3", [1.95, 2.89, 5.13, 6.86, 7.96, 10.08, 12.09]);
scaleFamiliesDict.set("7balafon4", [1.51, 3.45, 5.26, 6.60, 8.61, 10.25, 11.41]);
scaleFamiliesDict.set("7balafon5", [1.69, 3.50, 5.43, 7.09, 8.94, 10.40, 12.05]);
scaleFamiliesDict.set("7balafon6", [1.14, 3.50, 5.50, 6.87, 8.38, 10.32, 11.96]);
scaleFamiliesDict.set("5balafon7", [0, 2.02, 3.70, 6.85, 9.03]);
scaleFamiliesDict.set("7didymus", getRatiosScaleValues([0, 16 / 15, 10 / 9, 4 / 3, 3 / 2, 8 / 5, 5 / 3]));
scaleFamiliesDict.set("5hirajoshi_trad", [0, 1.85, 3.37, 6.83, 7.90]);
scaleFamiliesDict.set("7pelog_norm", [1.20, 2.70, 5.40, 6.70, 7.85, 9.50, 12.15]);
//scaleFamiliesDict.set("7ptolemy_di",     [0, 0.90225, 2.94135, 4.98045, 7.01955, 7.92180, 9.96090]);
scaleFamiliesDict.set("7ptolemy_di", getRatiosScaleValues([0, 256 / 243, 32 / 27, 4 / 3, 3 / 2, 128 / 81, 16 / 9]));
scaleFamiliesDict.set("7ptolemy_he", getRatiosScaleValues([0, 12 / 11, 6 / 5, 4 / 3, 3 / 2, 18 / 11, 9 / 5]));
scaleFamiliesDict.set("7raga_bageshri", [0, 1.82404, 2.94135, 4.98045, 7.01955, 8.84359, 9.96090]);
scaleFamiliesDict.set("8raga_bhairavi", [0, 1.11731, 2.03910, 3.15641, 5.19551, 7.01955, 8.13686, 10.17596]);
scaleFamiliesDict.set("7raga_kafi", [0, 2.03910, 2.94135, 4.98045, 7.01955, 8.84359, 9.96090]);
scaleFamiliesDict.set("7raga_todi", [0, 0.90225, 2.94135, 5.90224, 7.01955, 7.92180, 10.88269]);
scaleFamiliesDict.set("7raga_yaman", [0, 2.03910, 3.86314, 5.90224, 7.01955, 9.05865, 10.88269]);
scaleFamiliesDict.set("5slendro", [2.31, 4.74, 7.17, 9.55, 12.08]);
scaleFamiliesDict.set("7thai_ranat", [0, 1.61, 3.46, 5.26, 6.86, 8.62, 10.28571]);
// equal temperament subsets
// TODO: refactor to compute scale values in function
//scaleFamiliesDict.set("22approx_128edo",    [0, 0.53273, 1.04955, 1.67462, 2.15891, 2.74582, 3.31349, 3.86314, 4.39587, 4.91269, 5.41453, 5.99815, 6.56273, 7.10948, 7.63950, 8.15376, 8.73505, 9.29744, 9.84215, 10.37023, 10.88269, 11.45036]);
scaleFamiliesDict.set("6augment_21edo", getEDOSubsetScaleValues(21, [0, 4, 7, 11, 14, 18])); // 4 3 4 3 4 3
scaleFamiliesDict.set("10blackdye_27edo", getEDOSubsetScaleValues(27, [0, 1, 5, 7, 11, 12, 16, 18, 22, 23])); // 1 4 2 4 1 4 2 4 1 4
scaleFamiliesDict.set("10blackwood_15edo", getEDOSubsetScaleValues(15, [0, 2, 3, 5, 6, 8, 9, 11, 12, 14])); // 2 1 2 1 2 1 2 1 2 1
scaleFamiliesDict.set("7cata_246edo", getEDOSubsetScaleValues(246, [0, 14, 65, 79, 130, 144, 195])); // 14 51 14 51 14 51 51
scaleFamiliesDict.set("8father_13edo", getEDOSubsetScaleValues(13, [0, 2, 4, 5, 7, 9, 10, 12])); // 2 2 1 2 2 1 2 1
scaleFamiliesDict.set("12flattone_26edo", getEDOSubsetScaleValues(26, [0, 1, 4, 5, 8, 11, 12, 15, 16, 19, 20, 23])); // 1 3 1 3 3 1 3 1 3 1 3 3
scaleFamiliesDict.set("8harmonic_31edo", getEDOSubsetScaleValues(31, [0, 5, 10, 14, 18, 22, 25, 28])); // 5 5 4 4 4 3 3 3
scaleFamiliesDict.set("7hutington_400edo", getEDOSubsetScaleValues(400, [0, 43, 119, 162, 205, 281, 324])); // 43 76 43 43 76 43 76
scaleFamiliesDict.set("9island_313edo", getEDOSubsetScaleValues(313, [0, 53, 65, 118, 130, 183, 195, 248, 260])); // 53 12 53 12 53 12 53 12 53
scaleFamiliesDict.set("5keen_284edo", getEDOSubsetScaleValues(284, [0, 75, 130, 166, 221])); // 75 55 36 55 63
//scaleFamiliesDict.set("10lemba_26edo",      [0, 1.38462, 2.30769, 3.69231, 4.61538, 6.00000, 7.38462, 8.30769, 9.69231, 10.61538]);
scaleFamiliesDict.set("5machine_28edo", getEDOSubsetScaleValues(28, [0, 5, 13, 18, 23])); // 5 8 5 5 5
scaleFamiliesDict.set("6machine_11edo", getEDOSubsetScaleValues(11, [0, 2, 4, 6, 8, 10])); // 2 2 2 2 2 1
scaleFamiliesDict.set("11machine_28edo", getEDOSubsetScaleValues(28, [0, 3, 5, 8, 10, 13, 15, 18, 21, 23, 26])); // 3 2 3 2 3 2 3 3 2 3 2
scaleFamiliesDict.set("7mavila_16edo", getEDOSubsetScaleValues(16, [0, 2, 4, 7, 9, 11, 13])); // 2 2 3 2 2 2 3
scaleFamiliesDict.set("9mavila_16edo", getEDOSubsetScaleValues(16, [0, 1, 3, 5, 7, 8, 10, 12, 14])); // 1 2 2 2 1 2 2 2 2
//scaleFamiliesDict.set("19meantone_31edo",   [0, 0.38710, 1.16129, 1.54839, 2.32258, 3.09677, 3.48387, 4.25806, 5.03226, 5.41935, 6.19355, 6.58065, 7.35484, 8.12903, 8.51613, 9.29032, 10.06452, 10.45161, 11.22581]);
scaleFamiliesDict.set("6mothra_31edo", getEDOSubsetScaleValues(31, [0, 6, 12, 18, 24, 30])); // 6 6 6 6 6 1
scaleFamiliesDict.set("9orwell_22edo", getEDOSubsetScaleValues(22, [0, 2, 5, 7, 10, 12, 15, 17, 20])); // 2 3 2 3 2 3 2 3 2
scaleFamiliesDict.set("12pajara_22edo", getEDOSubsetScaleValues(22, [0, 2, 4, 6, 8, 10, 11, 13, 15, 17, 19, 21])); // 2 2 2 2 2 1 2 2 2 2 2 1
//scaleFamiliesDict.set("7pepperoni_271edo",  [0, 2.0811808, 2.8782288, 4.9594096, 7.0405904, 7.8376384, 9.9188192]);
scaleFamiliesDict.set("7porcupine_22edo", getEDOSubsetScaleValues(22, [0, 3, 6, 9, 13, 16, 19])); // 3 3 3 4 3 3
scaleFamiliesDict.set("8porcupine_22edo", getEDOSubsetScaleValues(22, [0, 3, 6, 9, 12, 15, 18, 21])); // 3 3 3 3 3 3 3 1
scaleFamiliesDict.set("5radon_128edo", getEDOSubsetScaleValues(128, [0, 25, 50, 75, 103])); // 25 25 25 28 25
scaleFamiliesDict.set("7rast_17edo", getEDOSubsetScaleValues(17, [0, 3, 5, 7, 10, 13, 15])); // 3 2 2 3 3 2 2
scaleFamiliesDict.set("7roulette_37edo", getEDOSubsetScaleValues(37, [0, 6, 12, 18, 24, 30, 31])); // 6 6 6 6 6 1 6
scaleFamiliesDict.set("5score_20edo", getEDOSubsetScaleValues(20, [0, 7, 9, 16, 18])); // 7 2 7 2 2
scaleFamiliesDict.set("7score_20edo", getEDOSubsetScaleValues(20, [0, 5, 7, 9, 14, 16, 18])); // 5 2 2 5 2 2 2
scaleFamiliesDict.set("5sensi_46edo", getEDOSubsetScaleValues(46, [0, 12, 17, 29, 34])); // 12 5 12 5 12
scaleFamiliesDict.set("11sensi_46edo", getEDOSubsetScaleValues(46, [0, 5, 10, 15, 17, 22, 27, 32, 34, 39, 44])); // 5 5 5 2 5 5 5 2 5 5 2
scaleFamiliesDict.set("12superpyth_17edo", getEDOSubsetScaleValues(17, [0, 1, 2, 4, 5, 7, 8, 9, 11, 12, 14, 15])); // 1 1 2 1 2 1 1 2 1 2 1 2
scaleFamiliesDict.set("7zarlino_29edo", getEDOSubsetScaleValues(29, [0, 5, 9, 14, 17, 22, 26])); // 5 4 5 3 5 3 3
scaleFamiliesDict.set("7zeus_tri_99edo", getEDOSubsetScaleValues(99, [0, 13, 32, 45, 58, 77, 90])); // 13 19 13 13 19 13 9
// misc
scaleFamiliesDict.set("7archy", [0, 2.1864407, 2.7203390, 4.9067797, 7.0932203, 9.2796610, 9.8135593]);
scaleFamiliesDict.set("10ganymede", [0, 1.50637, 2.89210, 4.17508, 5.93718, 7.01955, 8.03822, 9.46195, 9.91165, 10.77744]);
scaleFamiliesDict.set("7glacial", [0, 1.8573, 3.7146, 5.5718, 7.4291, 9.2864, 11.1437]);
scaleFamiliesDict.set("6hexany1379", [0, 2.03910, 2.66871, 4.70781, 7.01955, 9.68826]);
scaleFamiliesDict.set("13lovecraft", [0, 0.8275862, 1.9655172, 2.7931034, 3.6206897, 4.7586207, 5.5862069, 6.4137931, 7.5517241, 8.3793103, 9.2068966, 10.0344828, 11.1724138]);
scaleFamiliesDict.set("19madagascar", [0, 0.6517572, 1.3801917, 1.8402556, 2.4920128, 3.1437700, 3.8722045, 4.5239617, 4.9840256, 5.6357827, 6.3642173, 7.0159744, 7.4760383, 8.1277955, 8.8562300, 9.5079872, 10.1597444, 10.6198083, 11.3482428]);
scaleFamiliesDict.set("7magic", [0, 3.2275862, 3.8068966, 7.0344828, 7.6137931, 10.8413793, 11.4206897]);
scaleFamiliesDict.set("12meantone", [0, 1.139284, 1.944286, 3.083571, 3.888573, 5.027857, 5.832859, 6.972143, 8.111427, 8.916429, 10.055713, 10.860716]);
scaleFamiliesDict.set("7myna", [0, 2.6966292, 3.1011236, 5.7977528, 6.2022472, 8.8988764, 9.3033708]);
scaleFamiliesDict.set("7orgone", [0, 2.298849, 3.233717, 5.532566, 6.467434, 8.766283, 9.701151]);
scaleFamiliesDict.set("5orwell", [0, 2.7142857, 3.8571429, 6.5714286, 9.2857143]);
scaleFamiliesDict.set("5pygmy", [0, 2.31174, 4.70781, 7.01955, 9.68826]);
scaleFamiliesDict.set("10pygmy", [0, 2, 2.31174, 4, 4.70781, 7.01955, 9, 9.68826, 10, 11]);
scaleFamiliesDict.set("11semaphore", [0, 0.7954, 1.7637, 2.5591, 4.3228, 5.1182, 6.8818, 7.6773, 9.4409, 10.2364, 11.2046]);
scaleFamiliesDict.set("7silver", [0, 1.2813142, 3.5728953, 4.8542094, 7.1457906, 8.4271047, 9.7084189]);
scaleFamiliesDict.set("5slendric", [0, 2.3368421, 4.6736842, 7.0105263, 9.6631579]);
scaleFamiliesDict.set("8star", [0, 0.7792208, 3.1168831, 3.8961039, 6.2337662, 7.0129870, 8.8831169, 10.1298701]);
scaleFamiliesDict.set("7suhajira", [0, 2.1583055, 3.5395764, 4.9208473, 7.0791527, 8.4604236, 10.6187291]);
scaleFamiliesDict.set("17supermariner", [0, 0.45258, 1.76639, 2.21897, 2.67155, 3.12412, 4.43794, 4.89052, 5.34309, 6.65691, 7.10948, 7.56206, 8.87588, 9.32845, 9.78103, 10.23361, 11.54742]);
scaleFamiliesDict.set("10syntonic_dipenta", [0, 0.21506, 2.03910, 3.15641, 4.98045, 5.19551, 7.01955, 8.13686, 9.96090, 10.17596]);
scaleFamiliesDict.set("7tetrachordal", [0, 1.82404, 3.47408, 4.98045, 7.01955, 8.84359, 10.49363]);
scaleFamiliesDict.set("9triphi", [0, 1.5278640, 3.0557281, 4, 5.5278640, 7.0557281, 8, 9.5278640, 11.0557281]);
// no octave
scaleFamiliesDict.set("65cent_et", [0.65]);
scaleFamiliesDict.set("88cent_et", [0.88]);
scaleFamiliesDict.set("13bohlen_pierce", [1.46304, 2.92608, 4.38913, 5.85217, 7.31521, 8.77825, 10.24130, 11.70434, 13.16738, 14.63042, 16.09347, 17.55651, 19.01955]);
scaleFamiliesDict.set("13bohlen_pierce_ji", [1.33238, 3.01847, 4.35084, 5.82512, 7.36931, 8.84359, 10.17596, 11.65024, 13.19443, 14.66871, 16.00108, 17.68717, 19.01955]);
scaleFamiliesDict.set("8golden_ratio", [1.2155, 1.9667, 3.1821, 4.3976, 5.1488, 6.3642, 7.1154, 8.3309]);
scaleFamiliesDict.set("12marveldene", [1.1601264, 2.3202527, 3.1692766, 4.3294029, 4.9984142, 6.1585405, 7.0075644, 8.1676907, 9.3278170, 9.9968282, 11.3369672, 12.0059784]);
scaleFamiliesDict.set("5mersh", [0.86265, 2.17449, 4.10520, 5.89714, 6.83627]);
scaleFamiliesDict.set("15porcupine", [1.0301585, 1.6273726, 2.2245866, 3.2547451, 3.8519592, 4.8821177, 5.4793318, 6.5094903, 7.1067043, 8.1368629, 8.7340769, 9.7642354, 10.3614495, 11.3916080, 11.9888220]);
scaleFamiliesDict.set("22porcupine", [0.5972140, 1.0301585, 1.6273726, 2.2245866, 2.6575311, 3.2547451, 3.8519592, 4.2849037, 4.8821177, 5.4793318, 5.9122762, 6.5094903, 7.1067043, 7.7039184, 8.1368629, 8.7340769, 9.3312909, 9.7642354, 10.3614495, 10.9586635, 11.3916080, 11.9888220]);
scaleFamiliesDict.set("9wendy_carlos_a", [0.78, 1.56, 2.34, 3.12, 3.90, 4.68, 5.46, 6.24, 7.02]);
scaleFamiliesDict.set("11wendy_carlos_b", [0.638, 1.276, 1.914, 2.552, 3.190, 3.828, 4.466, 5.104, 5.742, 6.380, 7.018]);
scaleFamiliesDict.set("20wendy_carlos_g", [0.351, 0.702, 1.053, 1.404, 1.755, 2.106, 2.457, 2.808, 3.159, 3.510, 3.861, 4.212, 4.563, 4.914, 5.265, 5.616, 5.967, 6.318, 6.669, 7.020]);
//////////////////////////////////// STRINGS //////////////////////////////////
// international
scalesDict_int.set("xenharmonics", "----------------- XENHARMONICS ----------------");
scalesDict_int.set("xen_title, sep", "");
scalesDict_int.set("xenharmonics_ji", "------------------ Just Intonation ------------------");
scalesDict_int.set("7ji_major,1", "Just intonation major");
scalesDict_int.set("7ji_minor,1", "Just intonation minor");
scalesDict_int.set("7ji_indian,1", "Just intonation indian");
scalesDict_int.set("43ji_harry_partch,1", "Harry Partch 43-tone");
scalesDict_int.set("12ji_kg_centaur,1", "Kraig Grady Centaur");
scalesDict_int.set("12ji_kg_centaura_harm,1", "Kraig Grady Centaura harmonic");
scalesDict_int.set("12ji_kg_centaura_sub,1", "Kraig Grady Centaura subharmonic");
scalesDict_int.set("12ji_pythagorean,1", "Pythagorean");
scalesDict_int.set("12ji_wendy_carlos_sj,1", "Wendy Carlos Super Just");
scalesDict_int.set("12ji_werckmeister_3,1", "Werckmeister III");
scalesDict_int.set("12ji_young_1799,1", "Young (1799)");
scalesDict_int.set("7ji_zarlino,1", "Zarlino");
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
scalesDict_int.set("7thai_ranat,1", "Thai Ranat");
scalesDict_int.set("trad,sep", "");
scalesDict_int.set("xenharmonics_tet", "-------------- Equal temperaments -------------");
for (const nbNotes of xenTETScalesNbNotes)
    scalesDict_int.set(`${nbNotes}tet,1`, `${nbNotes}-TET / ${nbNotes}-EDO`);
scalesDict_int.set("xen_tet,sep", "");
scalesDict_int.set("xenharmonics_tet_sub", "------- Equal temperaments subsets ------");
//scalesDict_int.set("22approx_128edo,1",   "Approx[22] (128-EDO)");
scalesDict_int.set("6augment_21edo,1", "Augment[6] (21-EDO)");
scalesDict_int.set("10blackdye_27edo,1", "Blackdye[10] (27-EDO)");
scalesDict_int.set("10blackwood_15edo,1", "Blackwood[10] (15-EDO)");
scalesDict_int.set("7cata_246edo,1", "Cata[7] (246-EDO)");
scalesDict_int.set("8father_13edo,1", "Father[8] (13-EDO)");
scalesDict_int.set("12flattone_26edo,1", "FlatTone[12] (26-EDO)");
scalesDict_int.set("8harmonic_31edo,1", "Harmonic[8] (31-EDO)");
scalesDict_int.set("7hutington_400edo,1", "Hutington[7] (400-EDO)");
scalesDict_int.set("9island_313edo,1", "Island / Madag. / Barbados[9] (313-EDO)");
scalesDict_int.set("5keen_284edo,1", "Keenanismic[5] (284-EDO)");
//scalesDict_int.set("10lemba_26edo,1",     "Lemba[10] (26-EDO)");
scalesDict_int.set("5machine_28edo,1", "Machine[5] (28-EDO)");
scalesDict_int.set("6machine_11edo,1", "Machine[6] (11-EDO)");
scalesDict_int.set("11machine_28edo,1", "Machine[11] (28-EDO)");
scalesDict_int.set("7mavila_16edo,1", "Mavila[7] (16-EDO)");
scalesDict_int.set("9mavila_16edo,1", "Mavila[9] (16-EDO)");
//scalesDict_int.set("19meantone_31edo,1",  "MeanTone[19] (31-EDO)");
scalesDict_int.set("6mothra_31edo,1", "Mothra[6] (31-EDO)");
scalesDict_int.set("9orwell_22edo,1", "Orwell[9] (22-EDO)");
scalesDict_int.set("12pajara_22edo,1", "Pajara[12] (22-EDO)");
//scalesDict_int.set("7pepperoni_271edo,1", "Pepperoni[7] (271-EDO)");
scalesDict_int.set("7porcupine_22edo,1", "Porcupine[7] (22-EDO)");
scalesDict_int.set("8porcupine_22edo,1", "Porcupine[8] (22-EDO)");
scalesDict_int.set("5radon_128edo,1", "Radon[5] (128-EDO)");
scalesDict_int.set("7rast_17edo,1", "Rast (17-EDO)");
scalesDict_int.set("7roulette_37edo,1", "Roulette[7] (37-EDO)");
scalesDict_int.set("5score_20edo,1", "Score[5] (20-EDO)");
scalesDict_int.set("7score_20edo,1", "Score[7] (20-EDO)");
scalesDict_int.set("5sensi_46edo,1", "Sensi[5] (46-EDO)");
scalesDict_int.set("11sensi_46edo,1", "Sensi[11] (46-EDO)");
scalesDict_int.set("12superpyth_17edo,1", "SuperPyth[12] (17-EDO)");
scalesDict_int.set("7zarlino_29edo,1", "Zarlino[7] (29-EDO)");
scalesDict_int.set("7zeus_tri_99edo,1", "Zeus[7]Tri (99-EDO)");
scalesDict_int.set("xen_tet_subsets,sep", "");
scalesDict_int.set("xenharmonics_misc_sub", "------------------- Miscellaneous ------------------");
scalesDict_int.set("7archy,1", "Archy[7]");
scalesDict_int.set("10ganymede,1", "Ganymede[10]");
scalesDict_int.set("7glacial,1", "Glacial[7]");
scalesDict_int.set("6hexany1379,1", "Hexany[6] 1-3-7-9");
scalesDict_int.set("13lovecraft,1", "Lovecraft[13]");
scalesDict_int.set("19madagascar,1", "Madagascar[19]");
scalesDict_int.set("7magic,1", "Magic[7]");
scalesDict_int.set("12meantone,1", "Meantone[12]");
scalesDict_int.set("7myna,1", "Myna[7]");
scalesDict_int.set("7orgone,1", "Orgone[7]");
scalesDict_int.set("5orwell,1", "Orwell[5]");
scalesDict_int.set("5pygmy,1", "Pygmy[5]");
scalesDict_int.set("10pygmy,1", "Pygmy[10]");
scalesDict_int.set("11semaphore,1", "Semaphore[11]");
scalesDict_int.set("7silver,1", "Silver[7]");
scalesDict_int.set("5slendric,1", "Slendric[5]");
scalesDict_int.set("8star,1", "Star[8]");
scalesDict_int.set("7suhajira,1", "Suhajira[7]");
scalesDict_int.set("17supermariner,1", "Supermariner[17]");
scalesDict_int.set("10syntonic_dipenta,1", "Syntonic dipentatonic");
scalesDict_int.set("7tetrachordal,1", "Tetrachordal[7]");
scalesDict_int.set("9triphi,1", "Triphi[9]");
scalesDict_int.set("xen_misc,sep", "");
scalesDict_int.set("xenharmonics_no_sub", "------------------ Without octave -----------------");
scalesDict_int.set("65cent_et,1", "65 cent equal temperament");
scalesDict_int.set("88cent_et,1", "88 cent equal temperament");
scalesDict_int.set("13bohlen_pierce,1", "Bohlen-Pierce equal (13EDO3)");
scalesDict_int.set("13bohlen_pierce_ji,1", "Bohlen-Pierce just intonation");
scalesDict_int.set("8golden_ratio,1", "Golden ratio");
scalesDict_int.set("12marveldene,1", "Marveldene");
scalesDict_int.set("5mersh,1", "Mersh");
scalesDict_int.set("15porcupine,1", "Porcupine[15]");
scalesDict_int.set("22porcupine,1", "Porcupine[22]");
scalesDict_int.set("9wendy_carlos_a,1", "Wendy Carlos Alpha");
scalesDict_int.set("11wendy_carlos_b,1", "Wendy Carlos Beta");
scalesDict_int.set("20wendy_carlos_g,1", "Wendy Carlos Gamma");
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
scalesDict_fr.set("13bohlen_pierce_ji,1", "Bohlen-Pierce intonation juste");
scalesDict_fr.set("8golden_ratio,1", "Nombre d'or");
function getEDOScaleValues(temperament) {
    let scaleValues = [];
    for (let i = 0; i < temperament; i++)
        scaleValues.push(12 * i / temperament);
    return scaleValues;
}
function getEDOSubsetScaleValues(temperament, indexes) {
    if (indexes == null || indexes.length == 0)
        return [];
    let scaleValues = [];
    for (const i of indexes)
        scaleValues.push(12 * i / temperament);
    return scaleValues;
}
function getRatiosScaleValues(ratios) {
    if (ratios == null || ratios.length == 0)
        return [];
    let scaleValues = [];
    for (const ratio of ratios)
        scaleValues.push((ratio == 0) ? 0 : 12 * Math.log2(ratio));
    return scaleValues;
}
//# sourceMappingURL=scales_xenharmonic.js.map