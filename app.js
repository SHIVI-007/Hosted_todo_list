const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const mongoose = require('mongoose');
const _ = require("lodash");

	
main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery',false);
  await mongoose.connect('mongodb://mongo:27017/todolistdb',{useNewUrlParser: true});
  }

const app = express();

// creating schema named as list with name variable with sring type.
const list = mongoose.Schema({

	name : String

});



// creating items (single table type ) and intialize with an object item
const item = mongoose.model('items', list);

// creating first item item1
const item1 = new item({

	name : "welcome to hosted todo list" 

});





// creating second item item2

const item2 = new item({

	name : "Hit +  to add item to items list to this new list hence update again   "

});


// creating third item item3

const item3 = new item({

	name: "check the checkbox it will delete element"

});

// Putting items into default item array
const defaultitem = [item1 , item2 , item3];

const listSchema = mongoose.Schema({
	name: String,
	item: [list]
});

const listing = mongoose.model("List",listSchema);


// setting view engine for ejs
app.set('view engine','ejs');

// bodyparser for axising the element
app.use(bodyParser.urlencoded({extended:true}));

// for axising the public librarey for style sheet
app.use(express.static("public"));



app.get("/",function(req , res){

	const day = date.getDate();

	item.find({},function(err, foundItems){

		

			if(foundItems.length === 0)
			{
				item.insertMany(defaultitem, function(err){

		       if(err)
		         {
			       console.log(err);
		          }
		       else {
			       console.log("sucessful add default");
		            }



	                });

				res.redirect("/");

			}
			
			else
			{
				
				res.render("list",{listtitle:"Today", newlistitems: foundItems});

			}


		});

	
});


app.get("/:customInput", function(req,res){

	const CustomInput = _.capitalize(req.params.customInput);

	

	listing.findOne({name: CustomInput}, function(err, foundlist){

		if(!err)
		{
			if(!foundlist)
			{
				// not found

				const Lists = new listing({

		        name: CustomInput,
		        item: defaultitem

	         });

				Lists.save();

				res.redirect("/"+CustomInput);


			}

			else
			{
				// find it 

				res.render("list",{listtitle: foundlist.name, newlistitems: foundlist.item});

			}
		}


	});



});





app.post("/",function(req, res){

	console.log(req.body);

	const listname = req.body.list;

	console.log(listname);

    const enterItem = new item({

		name : req.body.listitem

	}) ;


	if(listname === "Today")
	{
		enterItem.save();

	res.redirect("/");
	}

	else
	{
		listing.findOne({name: listname},function(err, foundlist){

			foundlist.item.push(enterItem);
			foundlist.save();
			res.redirect("/"+ listname);


		});
	}

	

	

	
});


app.post("/delete", function(req, res){

	const del= req.body.checkbox;
	const listName = req.body.listName;
	console.log(listName);

	if(listName === "Today")
	{
		item.findByIdAndDelete(del,function(err){

		if(!err)
		{
			res.redirect("/");
		}

	});
	}
	else{

		listing.findOneAndUpdate({name: listName} , {$pull:{item: {_id: del}}} ,function(err , foundList){

			if(!err){

				res.redirect("/" + listName);
			}

		});
	}


});


app.get("/work", function(req , res){

	res.render("list",{listtitle:"Work day", newlistitems: items_w
	});

});




app.listen(3000,function() {
	console.log('The port is listining');
});


 