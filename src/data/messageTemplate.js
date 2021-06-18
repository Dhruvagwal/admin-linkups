export default (data, template)=>{
    if(template===0){
        return `Hurry Up!! ${data.name.split(" ")[0]} Ji.\n\n${data.profile.name.split(' ')[0]} Ji, is looking for an ${data.category.name} for 🔥${data.subCategory.name}🔥\nshow you interest through Linkups
        `
    }
    else if(template===2){
        return `Hurray!!\n${data.profile.name.split(' ')[0]} Ji wants your \n🔥${data.subCat.name}🔥 service\nTo know more Go To Linkups Provider app`
    }
}
