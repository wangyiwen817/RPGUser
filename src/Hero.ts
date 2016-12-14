var Cache: MethodDecorator = (target : any,propertyKey,descriptor : PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function(){
        //console.log(target,propertyKey)
        var cacheKey = "__cache" + propertyKey;
        if(!target[cacheKey]){
            target[cacheKey] = method.apply(this);
        }
            return target[cacheKey];
    }
}

enum Quality {
    WHITE = 1,
    GREEN = 1.1,
    BLUE = 1.2,
    PURPLE = 1.4,
    ORAGE = 1.8
}

enum WeaponType {
    HANDSWORD = 1,
    GREATSWORD = 1.8,
    AXE = 2,
    KATANA = 1.5,
    HAMMER = 2.5
}

enum ArmorType{
    LIGHTARMOR = 1,
    LEATHERARMOR = 1.4,
    PLATEARMOR = 2,
    HEAVYARMOR = 2.4,
    NOTHINGTOWEAR = 0.2
}

enum JewelPromotion{
    ATTACKPRMOTE = 1,
    DEFENCEPRMOTE = 2,
    AGILEPRMOTE = 3,
}



class User{
    currentExp : number = 0;
    totalExp = 0;
    level : number = 1;
    diamonds : number = 0;
    gold : number = 0;
    __heros : Hero [] = [];
    __herosInTeam : Hero[] = [];
    userName : string = "";

    constructor(name : string , level : number){
       this.userName = name;
       this.level = level;
    }

    @Cache
     getTotalExp(){
         this.totalExp = (this.level + 60) * this.level;
         return this.totalExp;
     }

    public addHeros(hero : Hero){
       this.__heros.push(hero);
    }


    public addHeroInTeam(hero : Hero){
       this.__herosInTeam.push(hero);
    }

    @Cache
    getFightPower(){
        var result = 0;
        this.__herosInTeam.forEach(hero => result += hero.getFightPower());
        return result;
    }

    
}

class Hero{
    isInTeam : boolean = false;
    name : string = "";
    quality  = 0;
    maxHP = 0;
    currentHP = 0;
    attack = 0;
    defence = 0;
    agile = 0;
    level = 1;
    currentExp = 0;
    totalExp = 0;
    //__equipmentsOnEquip : Equipment[] = [];
    __weaponsOnEquip : Weapon[] = [];
    __armorOnEquip : Armor[] = [];

    constructor(name : string, quality : Quality, level : number){
       this.name = name;
       this.quality = quality;
       this.level = level;
    }

     @Cache
     getTotalExp(){
         this.totalExp = (this.level + 50) * this.level;
         return this.totalExp;
     }

    public addWeapon(weapon : Weapon){
       this.__weaponsOnEquip.push(weapon);
    }

    public addArmor(armor : Armor){
       this.__armorOnEquip.push(armor);
    }

    @Cache
    getMaxHP(){
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getFightPower() * 0.2);
        this.__armorOnEquip.forEach(armor => result += armor.getFightPower() * 0.8);
        result += this.level * 10 * this.quality;
        return result;
    }
    
    @Cache
    getAttack(){
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getAttack() * 0.5);
        result += this.level * 5 * this.quality;
        return result;
    }

    @Cache
    getDefence(){
        var result = 0;
        this.__armorOnEquip.forEach(armor => result += armor.getDefence() * 0.2);
        result += this.level * 2 * this.quality;
        return result;
    }

    @Cache
    getAglie(){
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getAglie() * 0.4);
        this.__armorOnEquip.forEach(armor => result += armor.getAglie() * 0.4);
        result += this.level * 4 * this.quality;
        return result;
    }

    @Cache
    getFightPower(){
        var result = 0;
        this.__weaponsOnEquip.forEach(weapon => result += weapon.getFightPower());
        this.__armorOnEquip.forEach(armor => result += armor.getFightPower());
        result += (10 + this.getAttack() * 10 + this.getDefence() * 8 + this.getAglie() * 6) * this.level * this.quality;
        return result;
    }
}

class Equipment{
    quality  = 0;
    //level = 1;
    currentExp = 0;
    //totalExp = 0;
    //agile = 0;
    isWeapon = false;
    name : string = "";
    __jewelOnEquip : Jewel[] = [];

    //  @Cache
    //  getTotalExp(){
    //      this.totalExp = (this.level + 20) * this.level;
    //      return this.totalExp;
    //  }

    @Cache
    getFightPower(){
        return 0;
    }

    public addJewl(jewel : Jewel){
        this.__jewelOnEquip.push(jewel);
    }

}

class Weapon extends Equipment{
     //attack = 0;
     isWeapon = true;
     weaponType = 0;

     constructor(name : string ,quality : number , weaponType : WeaponType){
         super();
         this.name = name;
         this.quality = quality;
         //this.level = level;
         this.weaponType = weaponType;

     }


     @Cache
     getAttack(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
         result += 10 * this.weaponType * this.quality; 
         return result;
     }

     @Cache
     getAglie(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
         result += 5 * this.quality / this.weaponType; 
         return result;
     }


     @Cache
     getFightPower(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower());
         result += this.getAttack() * this.quality * 10 + this.getAglie() * this.quality * 5;
         return result;
     }
}

class Armor extends Equipment{
     //defence = 0;
     armorType = 0;
     isWeapon = false;

     constructor(name : string,quality : number , armorType : ArmorType){
         super();
         this.name = name;
         this.quality = quality;
         this.armorType = armorType;

     }

     

     @Cache
     getDefence(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
         result += 6 * this.armorType * this.quality; 
         return result;
     }

     @Cache
     getAglie(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower() * 0.4);
         result += 5 * this.quality / this.armorType; 
         return result;
     }

     @Cache
     getFightPower(){
         var result = 0;
         this.__jewelOnEquip.forEach(jewel => result += jewel.getFightPower());
         result += this.getDefence() * this.quality * 10 + this.getAglie() * this.quality * 5;
         return result;
     }
}

class Jewel{
    quality  = 0;
    //promotionType = 0;

    constructor(quality : number){
        this.quality = quality;
    }

    @Cache
    getFightPower(){
        var result = 0;
        result = this.quality * 10;
        return result;
    }
}