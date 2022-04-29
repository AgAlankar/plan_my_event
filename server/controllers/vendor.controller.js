const Vendor = require("../models/vendor");

module.exports.create = function (req, res) {
    // Validate request
    Vendor.findOne({email: req.body.email}, function (err, vendor) {
        if (vendor) {
            console.log('Email ID already registered');
            res.redirect('/');
        } else if (err) {
            console.log(err.message);
            res.redirect('/');
        } else {
            //Create a vendor
            const vendor = new Vendor({
                username: req.body.username,
                password: req.body.password,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                location: req.body.location
            })
            vendor.save().then(data => {
                console.log("Data inserted!");

                res.send(data);
            }).catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Vendor."
                });
            });
        }
    });
};

module.exports.findOne = function (req, res) {
    const id = req.params.id;
    Vendor.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found Vendor with id " + id});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({message: "Error retrieving Vendor with id=" + id});
        });
};

module.exports.update = function (req, res) {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!"
        });
    }
    const id = req.params.id;
    Vendor.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update vendor with id=${id}. Maybe Vendor was not found!`
                });
            } else res.send({message: "Vendor was updated successfully."});
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Vendor with id=" + id
            });
        });
};

module.exports.delete = function (req, res) {
    const id = req.params.id;
    Vendor.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Vendor with id=${id}. Maybe Vendor was not found!`
                });
            } else {
                res.send({
                    message: "Vendor was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Vendor with id=" + id
            });
        });
};

module.exports.findByLocation = function (req, res) {
    const loc = req.body.location;
    Vendor.find({location: loc})
        .then(data => {
            if (!data)
                res.status(404).send({message: "Not found vendor with location " + loc});
            else res.send(data);
        })
        .catch(err => {
            res
                .status(500)
                .send({message: "Error retrieving vendors from location " + loc});
        });
}