// scales families dictionary
var scaleFamiliesDict = {};

// 8 notes
scaleFamiliesDict["8bebop_dom"]      = [0, 2, 4, 5, 7, 9, 10, 11];
scaleFamiliesDict["8bebop_maj"]      = [0, 2, 4, 5, 7, 8, 9, 11];
scaleFamiliesDict["8bebop_min_melo"] = [0, 2, 3, 5, 7, 8, 9, 11];
scaleFamiliesDict["8bebop_min_harm"] = [0, 2, 3, 5, 7, 8, 10, 11];
scaleFamiliesDict["8dim"]            = [0, 2, 3, 5, 6, 8, 9, 11];

// 7 notes
scaleFamiliesDict["7major_nat"]   = [0, 2, 4, 5, 7, 9, 11];
scaleFamiliesDict["7minor_harm"]  = [0, 2, 3, 5, 7, 8, 11];
scaleFamiliesDict["7minor_melo"]  = [0, 2, 3, 5, 7, 9, 11];
scaleFamiliesDict["7major_harm"]  = [0, 2, 4, 5, 7, 8, 11];
scaleFamiliesDict["7major_2harm"] = [0, 1, 4, 5, 7, 8, 11];
scaleFamiliesDict["7major_neap"]  = [0, 1, 3, 5, 7, 9, 11];
scaleFamiliesDict["7minor_neap"]  = [0, 1, 3, 5, 7, 8, 11];
scaleFamiliesDict["7major_hung"]  = [0, 3, 4, 6, 7, 9, 10];
scaleFamiliesDict["7persian"]     = [0, 1, 4, 5, 6, 8, 11];
scaleFamiliesDict["7verdi_enigm"] = [0, 1, 4, 6, 8, 10, 11];

// 6 notes
scaleFamiliesDict["6blues"]        = [0, 3, 5, 6, 7, 10];
scaleFamiliesDict["6strange"]      = [0, 2, 4, 6, 8, 10];
scaleFamiliesDict["6major_hexa"]   = [0, 2, 4, 5, 7, 9];
scaleFamiliesDict["6aug"]          = [0, 3, 4, 7, 8, 11];
scaleFamiliesDict["6prom"]         = [0, 2, 4, 6, 9, 10];
scaleFamiliesDict["6tritone"]      = [0, 1, 4, 6, 7, 10];
scaleFamiliesDict["6tritone_semi"] = [0, 1, 2, 6, 7, 8];
scaleFamiliesDict["6istrian"]      = [0, 1, 3, 4, 6, 7];

// 5 notes
scaleFamiliesDict["5major_penta"] = [0, 2, 4, 7, 9];
scaleFamiliesDict["5javanese"]    = [0, 4, 5, 7, 11];
scaleFamiliesDict["5jap_in"]      = [0, 1, 5, 7, 8];
scaleFamiliesDict["5jap_insen"]   = [0, 1, 5, 7, 10];


// scales translation dictionaries

// international

var scalesDict_int = {};

scalesDict_int["7notes"] = "------------------------ 7 NOTES ------------------------";

scalesDict_int["7major_nat,1"] = "Natural major / Ionian";
scalesDict_int["7major_nat,6"] = "Natural minor / Aeolian (6th mode)";
scalesDict_int["7major_nat,2,diff:7major_nat;6"] = "Dorian (2nd mode)";
scalesDict_int["7major_nat,3,diff:7major_nat;6"] = "Phrygian (3rd mode)";
scalesDict_int["7major_nat,4,diff:7major_nat;1"] = "Lydian (4th mode)";
scalesDict_int["7major_nat,5,diff:7major_nat;1"] = "Mixolydian (5th mode)";
scalesDict_int["7major_nat,7,diff:7major_nat;6"] = "Locrian (7th mode)";
scalesDict_int["7major_nat,sep"] = "";
scalesDict_int["7minor_harm,1,diff:7major_nat;6"] = "Harmonic minor";
scalesDict_int["7minor_harm,2,diff:7major_nat;7"] = "Locrian ♮6 (2nd mode)";
scalesDict_int["7minor_harm,3,diff:7major_nat;1"] = "Ionian augmented / Ionian #5 (3rd mode)";
scalesDict_int["7minor_harm,4,diff:7major_nat;2"] = "Romanian minor / Ukrainian Dorian (4th mode)";
scalesDict_int["7minor_harm,5,diff:7major_nat;3"] = "Phrygian dominant / Freygish (5th mode)";
scalesDict_int["7minor_harm,6,diff:7major_nat;4"] = "Lydian #2 (6th mode)";
scalesDict_int["7minor_harm,7,diff:7major_nat;7"] = "Locrian ♭4 ♭♭7 (7th mode)";
scalesDict_int["7minor_harm,sep"] = "";
scalesDict_int["7minor_melo,1,diff:7major_nat;6"] = "Melodic minor";
scalesDict_int["7minor_melo,2,diff:7major_nat;2"] = "Dorian ♭2 (2nd mode)";
scalesDict_int["7minor_melo,3,diff:7major_nat;4"] = "Lydian augmented / Lydian #5 (3rd mode)";
scalesDict_int["7minor_melo,4,diff:7major_nat;4"] = "Bartok / Lydian ♭7 (4th mode)";
scalesDict_int["7minor_melo,5,diff:7major_nat;5"] = "Mixolydian ♭6 (5th mode)";
scalesDict_int["7minor_melo,6,diff:7major_nat;7"] = "Half-diminished / Locrian ♮2 (6th mode)";
scalesDict_int["7minor_melo,7,diff:7major_nat;7"] = "Super Locrian / Altered (7th mode)";
scalesDict_int["7minor_melo,sep"] = "";
scalesDict_int["7major_2harm,1,diff:7major_nat;1"] = "Double harm. major / Byzantine / Gypsy";
scalesDict_int["7major_2harm,2,diff:7major_nat;4"] = "Lydian #2 #6 (2nd mode)";
scalesDict_int["7major_2harm,3,diff:7major_nat;3"] = "Ultra phrygian (3rd mode)";
scalesDict_int["7major_2harm,4,diff:7major_nat;6"] = "Hungarian minor (4th mode)";
scalesDict_int["7major_2harm,5"] = "Oriental / Asian (5th mode)";
scalesDict_int["7major_2harm,6,diff:7major_nat;1"] = "Ionian augmented #2 (6th mode)";
scalesDict_int["7major_2harm,7,diff:7major_nat;7"] = "Locrian ♭♭3 ♭♭7 (7th mode)";
scalesDict_int["7major_2harm,sep"] = "";
scalesDict_int["7major_harm,1,diff:7major_nat;1"] = "Harmonic major / Ionian ♭6";
scalesDict_int["7major_harm,2,diff:7major_nat;2"] = "Dorian ♭5 (2nd mode)";
scalesDict_int["7major_harm,3,diff:7major_nat;3"] = "Phrygian ♭4 (3rd mode)";
scalesDict_int["7major_harm,4,diff:7major_nat;4"] = "Lydian ♭3 / Melodic minor #4 (4th mode)";
scalesDict_int["7major_harm,5,diff:7major_nat;5"] = "Mixolydian ♭2 (5th mode)";
scalesDict_int["7major_harm,6,diff:7major_nat;4"] = "Lydian augmented #2 (6th mode)";
scalesDict_int["7major_harm,7,diff:7major_nat;7"] = "Locrian ♭♭7 (7th mode)";
scalesDict_int["7major_harm,sep"] = "";
scalesDict_int["7major_neap,1"] = "Neapolitan major";
scalesDict_int["7major_neap,4,diff:7major_nat;4"] = "Lydian minor (4th mode)";
scalesDict_int["7major_neap,5,diff:7major_nat;7"] = "Locrian major (5th mode)";
scalesDict_int["7major_neap,sep"] = "";
scalesDict_int["7minor_neap,1"] = "Neapolitan minor";
scalesDict_int["7minor_neap,4"] = "Hungarian gypsy (4th mode)";
scalesDict_int["7minor_neap,sep"] = "";
scalesDict_int["7major_hung,1"] = "Hungarian major";
scalesDict_int["7persian,1"] = "Persian";
scalesDict_int["7verdi_enigm,1"] = "Verdi's Enigmatica";
scalesDict_int["7others,sep"] = "";

scalesDict_int["8notes"] = "------------------------ 8 NOTES ------------------------";

scalesDict_int["8bebop_dom,1,diff:7major_nat;1"] = "Bebop dominant";
scalesDict_int["8bebop_dom,5,diff:7major_nat;2"] = "Bebop Dorian / Bebop minor (5th mode)";
scalesDict_int["8bebop_dom,sep"] = "";
scalesDict_int["8bebop_maj,1,diff:7major_nat;1"] = "Bebop major";
scalesDict_int["8bebop_min_harm,1,diff:7minor_harm;1"] = "Bebop harmonic minor";
scalesDict_int["8bebop_min_melo,1,diff:7minor_melo;1"] = "Bebop melodic minor";
scalesDict_int["8bebop_maj,sep"] = "";
scalesDict_int["8dim,1"] = "Diminished";
scalesDict_int["8dim,2"] = "Dominant diminished / Dom-dim (2nd mode)";
scalesDict_int["8others,sep"] = "";

scalesDict_int["6notes"] = "------------------------ 6 NOTES ------------------------";
scalesDict_int["6blues,1,diff:5major_penta;5"] = "Blues / Penta. minor + blue note";
scalesDict_int["6strange,1"] = "Whole tone / Strange / Debussy";
scalesDict_int["6major_hexa,1"] = "Hexatonic major";
scalesDict_int["6aug,1"] = "Augmented / Irish / Scottish";
scalesDict_int["6prom,1"] = "Prometheus";
scalesDict_int["6tritone,1"] = "Tritone / Petrushka";
scalesDict_int["6tritone_semi,1"] = "Two-semitone tritone";
scalesDict_int["6istrian,1"] = "Istrian";
scalesDict_int["6others,sep"] = "";

scalesDict_int["5notes"] = "------------------------ 5 NOTES ------------------------";
scalesDict_int["5major_penta,1"] = "Pentatonic major";
scalesDict_int["5major_penta,5"] = "Pentatonic minor / Yo (5th mode)";
scalesDict_int["5major_penta,2"] = "Egyptian / Suspended (2nd mode)";
scalesDict_int["5major_penta,3"] = "Blues minor / Man gong (3rd mode)";
scalesDict_int["5major_penta,4"] = "Blues major / Ritsusen (4th mode)";
scalesDict_int["5major_penta,sep"] = "";
scalesDict_int["5jap_in,1"] = "In";
scalesDict_int["5jap_in,2"] = "Hirajoshi (2nd mode)";
scalesDict_int["5jap_in,4"] = "Iwato (4th mode)";
scalesDict_int["5jap_in,sep"] = "";
scalesDict_int["5jap_insen,1"] = "Insen";
scalesDict_int["5jap_insen,5"] = "Kumoi (5th mode)";
scalesDict_int["5jap_insen,sep"] = "";
scalesDict_int["5javanese,1"] = "Javanese";
scalesDict_int["5javanese,2"] = "Balinese (2nd mode)";

// french

var scalesDict_fr = {};

scalesDict_fr["7major_nat,1"] = "Majeur naturelle / Ionien";
scalesDict_fr["7major_nat,6"] = "Mineure naturelle / Eolien (6e mode)";
scalesDict_fr["7major_nat,2,diff:7major_nat;6"] = "Dorien (2e mode)";
scalesDict_fr["7major_nat,3,diff:7major_nat;6"] = "Phrygien (3e mode)";
scalesDict_fr["7major_nat,4,diff:7major_nat;1"] = "Lydien (4e mode)";
scalesDict_fr["7major_nat,5,diff:7major_nat;1"] = "Mixolydien (5e mode)";
scalesDict_fr["7major_nat,7,diff:7major_nat;6"] = "Locrien (7e mode)";

scalesDict_fr["7minor_harm,1,diff:7major_nat;6"] = "Mineure harmonique";
scalesDict_fr["7minor_harm,2,diff:7major_nat;7"] = "Locrien ♮6 (2e mode)";
scalesDict_fr["7minor_harm,3,diff:7major_nat;1"] = "Ionien augmenté / Ionien #5 (3e mode)";
scalesDict_fr["7minor_harm,4,diff:7major_nat;2"] = "Roumaine mineure / Dorien Ukrainien (4e mode)";
scalesDict_fr["7minor_harm,5,diff:7major_nat;3"] = "Phrygien dominant / Phrygien majeur (5e mode)";
scalesDict_fr["7minor_harm,6,diff:7major_nat;4"] = "Lydien #2 (6e mode)";
scalesDict_fr["7minor_harm,7,diff:7major_nat;7"] = "Locrien ♭4 ♭♭7 (7e mode)";

scalesDict_fr["7minor_melo,1,diff:7major_nat;6"] = "Mineure mélodique";
scalesDict_fr["7minor_melo,2,diff:7major_nat;2"] = "Dorien ♭2 (2e mode)";
scalesDict_fr["7minor_melo,3,diff:7major_nat;4"] = "Lydien augmenté / Lydien #5 (3e mode)";
scalesDict_fr["7minor_melo,4,diff:7major_nat;4"] = "Bartok / Lydien ♭7 (4e mode)";
scalesDict_fr["7minor_melo,5,diff:7major_nat;5"] = "Mixolydien ♭6 (5e mode)";
scalesDict_fr["7minor_melo,6,diff:7major_nat;7"] = "Semi-diminuée / Locrien ♮2 (6e mode)";
scalesDict_fr["7minor_melo,7,diff:7major_nat;7"] = "Super Locrien / Altérée (7e mode)";

scalesDict_fr["7major_2harm,1,diff:7major_nat;1"] = "Majeure double harm. / Byzantine / Gitane";
scalesDict_fr["7major_2harm,2,diff:7major_nat;4"] = "Lydien #2 #6 (2e mode)";
scalesDict_fr["7major_2harm,3,diff:7major_nat;3"] = "Ultra phrygien (3e mode)";
scalesDict_fr["7major_2harm,4,diff:7major_nat;6"] = "Hongroise mineure (4e mode)";
scalesDict_fr["7major_2harm,5"] = "Orientale / Asiatique (5e mode)";
scalesDict_fr["7major_2harm,6,diff:7major_nat;1"] = "Ionien augmenté #2 (6e mode)";
scalesDict_fr["7major_2harm,7,diff:7major_nat;7"] = "Locrien ♭♭3 ♭♭7 (7e mode)";

scalesDict_fr["7major_harm,1,diff:7major_nat;1"] = "Majeure harmonique / Ionien ♭6";
scalesDict_fr["7major_harm,2,diff:7major_nat;2"] = "Dorien ♭5 (2e mode)";
scalesDict_fr["7major_harm,3,diff:7major_nat;3"] = "Phrygien ♭4 (3e mode)";
scalesDict_fr["7major_harm,4,diff:7major_nat;4"] = "Lydien ♭3 / Mineure mélodique #4 (4e mode)";
scalesDict_fr["7major_harm,5,diff:7major_nat;5"] = "Mixolydien ♭2 (5e mode)";
scalesDict_fr["7major_harm,6,diff:7major_nat;4"] = "Lydien augmenté #2 (6e mode)";
scalesDict_fr["7major_harm,7,diff:7major_nat;7"] = "Locrien ♭♭7 (7e mode)";

scalesDict_fr["7major_neap,1"] = "Napolitaine majeure";
scalesDict_fr["7major_neap,4,diff:7major_nat;4"] = "Lydien mineur (4e mode)";
scalesDict_fr["7major_neap,5,diff:7major_nat;7"] = "Locrien majeur (5e mode)";

scalesDict_fr["7minor_neap,1"] = "Napolitaine mineure";
scalesDict_fr["7minor_neap,4"] = "Hongroise gitane (4e mode)";

scalesDict_fr["7major_hung,1"] = "Hongroise majeure";
scalesDict_fr["7persian,1"] = "Perse";
scalesDict_fr["7verdi_enigm,1"] = "Verdi Enigmatica";

scalesDict_fr["8bebop_dom,1,diff:7major_nat;1"] = "Bebop dominant";
scalesDict_fr["8bebop_dom,5,diff:7major_nat;2"] = "Bebop dorien / Bebop mineur (5e mode)";

scalesDict_fr["8bebop_maj,1,diff:7major_nat;1"] = "Bebop majeur";
scalesDict_fr["8bebop_min_harm,1,diff:7minor_harm;1"] = "Bebop mineur harmonique";
scalesDict_fr["8bebop_min_melo,1,diff:7minor_melo;1"] = "Bebop mineur mélodique";

scalesDict_fr["8dim,1"] = "Diminuée";
scalesDict_fr["8dim,2"] = "Dominant diminué / Dom-dim (2e mode)";

scalesDict_fr["6blues,1,diff:5major_penta;5"] = "Blues / Penta. mineure + blue note";
scalesDict_fr["6strange,1"] = "Tons / Etrange / Debussy";
scalesDict_fr["6major_hexa,1"] = "Hexatonique majeure";
scalesDict_fr["6aug,1"] = "Augmentée / Irlandaise / Ecossaise";
scalesDict_fr["6prom,1"] = "Promethée";
scalesDict_fr["6tritone,1"] = "Triton / Petrouchka";
scalesDict_fr["6tritone_semi,1"] = "2 semi-tons triton";
scalesDict_fr["6istrian,1"] = "Istrien";

scalesDict_fr["5major_penta,1"] = "Pentatonique majeure";
scalesDict_fr["5major_penta,5"] = "Pentatonique mineure / Yo (5e mode)";
scalesDict_fr["5major_penta,2"] = "Egyptienne / Suspendue (2e mode)";
scalesDict_fr["5major_penta,3"] = "Blues mineur / Man gong (3e mode)";
scalesDict_fr["5major_penta,4"] = "Blues majeur / Ritsusen (4e mode)";

scalesDict_fr["5jap_in,1"] = "In";
scalesDict_fr["5jap_in,2"] = "Hirajoshi (2e mode)";
scalesDict_fr["5jap_in,4"] = "Iwato (4e mode)";

scalesDict_fr["5jap_insen,1"] = "Insen";
scalesDict_fr["5jap_insen,5"] = "Kumoi (5e mode)";

scalesDict_fr["5javanese,1"] = "Javanaise";
scalesDict_fr["5javanese,2"] = "Balinaise (2e mode)";


// global dictionary
var scalesDicts = {};
scalesDicts["int"] = scalesDict_int;
scalesDicts["fr"] = scalesDict_fr;


var scalesToHighlight = ["7major_nat,1", "7major_nat,6", "7minor_harm,1", "7minor_melo,1",
    "7major_2harm,1", "7major_harm,1", "7major_neap,1", "7minor_neap,1",
    "8bebop_dom,1", "8dim,1",
    "6blues,1", "6strange,1",
    "5major_penta,1", "5major_penta,5", "5jap_in,1", "5jap_insen,1", "5javanese,1"];

function hightlightScale(id)
{
    if (scalesToHighlight.includes(id))
        return true;

    var found = false;
    scalesToHighlight.forEach(function (idScale, index)
    {
        if (id.startsWith(idScale))
            found = true;
    });

    return found;
}