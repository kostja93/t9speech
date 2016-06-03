var map = [
    ['0', ' '],
    ['.',',', '!','1'],
    ['a','A','b','B','c','C','2'],
    ['d','D','e','E','f','F','3'],
    ['g','G','h','H','i','I','4'],
    ['j','J','k','K','l','L','5'],
    ['m','M','n','N','o','O','6'],
    ['p','P','q','Q','r','R','s','S','7'],
    ['t','T','u','U','v','V','8'],
    ['w','W','x','X','y','Y','z','Z','9']
];

module.exports = {
    map: map,

    charToT9: function (string) {
        var result = "";
        var getT9 = (char) => {

            for(var i = 0; i < map.length; i++) {
                if (map[i].indexOf(char) != -1)
                    return i;
            }

            throw "No valid char given";
        };

        for (var i = 0; i < string.length; i++) {
            result += getT9(string[i]);
        }

        return result;
    }
};