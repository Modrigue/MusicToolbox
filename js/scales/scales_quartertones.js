"use strict";
// 24-TET
scaleFamiliesDict.set("24tet", getEDOScaleValues(24));
// 8 notes quartertone
scaleFamiliesDict.set("8bastanikar", [0, 1.5, 3.5, 5, 6.5, 7.5, 10.5, 11.5]);
scaleFamiliesDict.set("8dalanshin", [0, 1, 2, 3.5, 5, 7, 9, 10.5]);
scaleFamiliesDict.set("8jiharkah", [0, 2, 4, 5, 7, 9, 10, 10.5]);
scaleFamiliesDict.set("8mehayar", [0, 1.5, 3, 5, 7, 8, 8.5, 10]);
scaleFamiliesDict.set("8kirdan", [0, 2, 3, 3.5, 5, 7, 9, 10.5]);
scaleFamiliesDict.set("8tet", getEDOScaleValues(8));
scaleFamiliesDict.set("8harmonic_approx", [0, 2, 4, 5.5, 7, 8.5, 9.5, 11]);
// 7 notes quartertone
scaleFamiliesDict.set("7hijaz", [0, 1, 4, 5, 7, 8.5, 10]);
scaleFamiliesDict.set("7rast", [0, 2, 3.5, 5, 7, 9, 10.5]);
scaleFamiliesDict.set("7bayati", [0, 1.5, 3, 5, 7, 8, 10]);
scaleFamiliesDict.set("7hardino", [0, 1.5, 4, 5, 7, 8.5, 11]);
scaleFamiliesDict.set("7mahur", [0, 2, 3.5, 5, 7, 9, 11]);
scaleFamiliesDict.set("7mustaar", [0, 2.5, 3.5, 5.5, 6.5, 8.5, 10.5]);
scaleFamiliesDict.set("7saba", [0, 1.5, 3, 4, 7, 8, 10]);
scaleFamiliesDict.set("7sikah_baladi", [0, 1.5, 3.5, 5, 7, 8.5, 10.5]);
scaleFamiliesDict.set("7nairuzb2", [0, 1, 3.5, 5, 7, 8.5, 10]);
scaleFamiliesDict.set("7oasis", [0, 1.5, 4, 5, 7, 8.5, 10]);
// others quartertone
scaleFamiliesDict.set("5tet_approx", [0, 2.5, 5, 7, 9.5]);
scaleFamiliesDict.set("6blues_micro", [0, 3.5, 5, 6, 7, 10.5]);
scaleFamiliesDict.set("9island_approx", [0, 2, 2.5, 4.5, 5, 7, 7.5, 9.5, 10]);
//////////////////////////////////// STRINGS //////////////////////////////////
// international
scalesDict_int.set("24notes_quarter_tones", "----------------------- ¼ TONES -----------------------");
scalesDict_int.set("24tet,1", `24-TET / 24-EDO`);
scalesDict_int.set("24tet,sep", "");
scalesDict_int.set("8notes_quarter_tones", "--------------- 8 NOTES ¼ TONES ---------------");
scalesDict_int.set("8harmonic_approx,1,diff:7major_nat;1", "Harmonic[8] (Approximation)");
scalesDict_int.set("8tet_harm,sep", "");
scalesDict_int.set("8jiharkah,1,diff:8bebop_dom;1", "Jiharkah");
scalesDict_int.set("8bastanikar,1,diff:8bebop_dom;1", "Bastanikar");
scalesDict_int.set("8dalanshin,1", "Dalanshin");
scalesDict_int.set("8kirdan,1", "Kirdan");
scalesDict_int.set("8mehayar,1,diff:7major_nat;6", "Mehayar / Hoseni / Rahaw");
scalesDict_int.set("8notes_quarter_tones,sep", "");
scalesDict_int.set("8tet,1", "8-TET / 8-EDO");
scalesDict_int.set("8tet,sep", "");
scalesDict_int.set("7notes_quarter_tones", "--------------- 7 NOTES ¼ TONES ---------------");
scalesDict_int.set("7hijaz,1,diff:7minor_harm;5", "Hijaz");
scalesDict_int.set("7hijaz,4,diff:7major_harm;1", "Suznak (4th mode)");
scalesDict_int.set("7hijaz,5,diff:7bayati;1", "Bayati Shuri (5th mode)");
scalesDict_int.set("7hijaz,6", "Huzam (6th mode)");
scalesDict_int.set("7hijaz,sep", "");
scalesDict_int.set("7rast,1,diff:7major_nat;2", "Rast");
scalesDict_int.set("7rast,2,diff:7major_nat;6", "Rattlesnake (2nd mode)");
scalesDict_int.set("7rast,5,diff:7major_nat;6", "Nairuz / Simdi Huseyni-Ussak (5th mode)");
scalesDict_int.set("7rast,6,diff:7major_nat;3", "Ashiran / Arazbar (6th mode)");
scalesDict_int.set("7rast,7,diff:7major_nat;1", "Iraq (7th mode)");
scalesDict_int.set("7rast,sep", "");
scalesDict_int.set("7bayati,1,diff:7major_nat;6", "Bayati");
scalesDict_int.set("7bayati,4,diff:7major_nat;6", "Ushaq Masri (4th mode)");
scalesDict_int.set("7bayati,sep", "");
scalesDict_int.set("7hardino,1,diff:7major_nat;1", "Hardino");
scalesDict_int.set("7mahur,1,diff:7major_nat;1", "Mahur");
scalesDict_int.set("7mustaar,1", "Musta'ar");
scalesDict_int.set("7saba,1", "Saba");
scalesDict_int.set("7notes_quarter_tones,sep", "");
scalesDict_int.set("7sikah_baladi,1,diff:7major_nat;1", "Sikah baladi / 7-TET (Approximation)");
scalesDict_int.set("7sikah_baladi,6,diff:7major_nat;1", "Neutral (6th mode)");
scalesDict_int.set("7sikah_baladi,sep", "");
scalesDict_int.set("7nairuzb2,1,diff:7major_nat;6", "Nairuz ♭2");
scalesDict_int.set("7oasis,1,diff:7minor_harm;5", "Oasis");
scalesDict_int.set("qtones_others", "--------------- OTHERS ¼ TONES ---------------");
scalesDict_int.set("5tet_approx,1,diff:5major_penta;4", "5-TET / 5-EDO (Approximation)");
scalesDict_int.set("6blues_micro,1,diff:6blues;1", "Blues (Microtonal)");
scalesDict_int.set("9island_approx,1", "Island / Madag. / Barbados[9] (Approx.)");
scalesDict_int.set("5notes_quarter_tones,sep", "");
/////////////////////////////////// FRENCH ////////////////////////////////////
scalesDict_fr.set("24notes_quarter_tones", "------------------------- ¼ TONS ------------------------");
scalesDict_fr.set("8notes_quarter_tones", "----------------- 8 NOTES ¼ TONS -----------------");
scalesDict_fr.set("7notes_quarter_tones", "----------------- 7 NOTES ¼ TONS -----------------");
scalesDict_fr.set("7hijaz,4,diff:7major_harm;1", "Suznak (4e mode)");
scalesDict_fr.set("7hijaz,5,diff:7bayati;1", "Bayati Shuri (5e mode)");
scalesDict_fr.set("7hijaz,6", "Huzam (6e mode)");
scalesDict_fr.set("7rast,2,diff:7major_nat;6", "Rattlesnake (2e mode)");
scalesDict_fr.set("7rast,5,diff:7major_nat;6", "Nairuz / Simdi Huseyni-Ussak (5e mode)");
scalesDict_fr.set("7rast,6,diff:7major_nat;3", "Ashiran / Arazbar (6e mode)");
scalesDict_fr.set("7rast,7,diff:7major_nat;1", "Iraq (7e mode)");
scalesDict_fr.set("7bayati,4,diff:7major_nat;6", "Ushaq Masri (4e mode)");
scalesDict_fr.set("7sikah_baladi,6,diff:7major_nat;1", "Neutre (6e mode)");
scalesDict_fr.set("qtones_others", "----------------- AUTRES ¼ TONS -----------------");
//# sourceMappingURL=scales_quartertones.js.map