const Doctor = require('./doctor.schema');
const Hospital = require("../hospital/hospital.schema");
const Department = require("../department/department.schema");
module.exports.add = async (req, res, next) => { 
    try {
        //get hospital By ID

        let hospital = await getHospitalById(req.body.hospitalId);
        // console.log(hospital);
        let department = await getDepartmentById(req.body.departmentId);
        // console.log(department);
        let doctorData = {
            name: req.body.name,
            qualification: req.body.qualification,
            department: department.departmentName,
            gender: req.body.gender,
            mobile: req.body.mobile,
            shifts: { 
                id: req.body.hospitalId,
                hospitalName: hospital.name,
                shift: req.body.shift
            }
        } 
        //console.log(doctorData);
        Doctor.create(doctorData)
        .then(result =>res.status(200).json({result}))
        .catch(error =>res.status(500).json({error}));
    } catch (error) {
        res.status(500).json({error});
    }
}


async function getHospitalById(hospitalId) {
    try {
        const hospital = await  Hospital.findById(hospitalId);    
        return hospital;
    } catch (error) {
      return error;   
    }
}

async function getDepartmentById(departmentId) {
    try {
        const department = await Department.findById(departmentId);
        return department;
    } catch (error) {
        return(error);
    }
}



 module.exports.findAll = (req, res) =>{
     Doctor.find()
     .then(doctors => res.status(200).json(doctors))
     .catch(error => res.status(500).json("Could not find doctors data", error));
 }

module.exports.findOne = (req, res, next) => {
    Doctor.findById(req.params.id)
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json("Couldn't find data with given ID"+ error));
}


module.exports.update = (req, res) =>{
   if(!req.body.name){
       return res.status(404).send({
           message: "Name cannot be empty"
       });
   }
   
   if(!req.body.qualification){
       return res.status(404).send({
           message: "Qualification cannot be empty"
       });
   }
   if(!req.body.department){
       return res.status(404).send({
           message: "Department cannot be empty"
       });
   }
   if(!req.body.gender){
       return res.status(404).send({
           message: "Gender cannot be empty"
       });
   }
   if(!req.body.mobile){
       return res.status(404).send({
           message: "Mobile cannot be empty"
       });
   }

   Doctor.findByIdAndUpdate(req.params.id, {
    $set:{
        name: req.body.name,
        qualification: req.body.qualification,
        department: req.body.department,
        gender: req.body.gender,
        mobile: req.body.mobile,
        shifts: { 
            id: req.body.id,
            hospitalName: req.body.hospitalName, 
            shift: req.body.shift
            }
        } 
    }, {new: true}) 
   .then(result => {
       if(!result){
           return res.status(404).send({
               message: "Data with given ID not found"+ req.params.id
           });
       }
       res.send(result);
   }).catch(error => {
       if(error.kind === 'ObjectId') {
           return res.status(404).send({
               message: "Data with given ID not found"+ req.params.id
           });
       }
       return res.status(500).send({
           message: "Error updating with ID"+ req.params.id
       });
   });
}


module.exports.deleteById = (req, res) => {
    Doctor.findByIdAndDelete(req.params.id)
    .then(result => res.status(200).send({
        message: "Data Deleted Successfully"
    })).catch(error => res.status(404).send({
        message: "Data with given Id not found"+ req.params.id
    }))
}

module.exports.findOne = (req, res) => {
    
}