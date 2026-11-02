const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const moment = require("moment");

// models imports
const Customer = require("./models/customerSchema");

// for DELETE and PUT Requests

var methodOverride = require("method-override");

app.use(methodOverride("_method"));

app.set("view engine", "ejs");

// images & CSS & JavaScript..
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Auto refresh:
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// DB connection
mongoose
  .connect(
    "mongodb+srv://MohammadAli:uDeOUM8ZbZs3qZ88@cluster0.lifg2vk.mongodb.net/customersData?",
  )
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// ======================= //
// routers:
//
// === GET Requests: === //
//
app.get("/", (req, res) => {
  Customer.find()
    .then((result) => {
      // console.log("=== the result is: ====");
      // console.log(result);

      res.render("index", { arr: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/user/add.html", (req, res) => {
  res.render("user/add");
});

app.get("/edit/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  Customer.findById({ _id: customerId })
    .then((result) => {
      res.render("user/edit", { customer: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// request thas has id params must be at the bottom
app.get("/user/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  Customer.findById({ _id: customerId })
    .then((result) => {
      res.render("user/view", { customer: result, moment: moment });
    })
    .catch((err) => {
      console.log(err);
    });
});

//
// === POST Requests: === //
//
// app.post("/user/add.html", (req, res) => {
//   console.log(req.body);

//   const customer = new Customer(req.body);

//   customer
//     .save()
//     .then((result) => {
//       res.redirect("/");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// === OR === //

app.post("/user/add.html", (req, res) => {
  Customer.create(req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/search", (req, res) => {
  const searchText = req.body.searchText;

  Customer.find({ $or: [{ firstName: searchText }, { lastName: searchText }] })
    .then((result) => {
      res.render("user/search", { arr: result, searchText: searchText });
    })
    .catch((err) => {
      console.log(err);
    });
});

// === PUT Requests: === //
//
app.put("/edit/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  Customer.updateOne({ _id: customerId }, req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

// === DELETE Requests: === //
//
app.delete("/delete/:customerId", (req, res) => {
  const customerId = req.params.customerId;

  Customer.deleteOne({ _id: customerId }).then((result) => {
    res.redirect("/");
  });
});
