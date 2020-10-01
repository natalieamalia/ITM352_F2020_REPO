age_count = 1; //start the age count
my_age = 20;
while(age_count < age){
    if(age_count >= age/2) {
        console.log("I'm old!")
        break;
    }
    console.log(`age ${age_count}`)
    age_count++;
}
