
class Cubic{
    constructor(id, name, description, imageUrl, difficultyLevel){
        this.id = id,  
        this.name = name,  
        this.description = description,  
        this.imageUrl = imageUrl,  
        this.difficultyLevel = +difficultyLevel
    };
}

const toExport = {
    Cubic,
};

module.exports = toExport;