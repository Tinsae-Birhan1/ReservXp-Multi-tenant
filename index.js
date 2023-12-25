// require('dotenv').config()
// const express = require('express')
// const mongoose = require('mongoose')
// const expressSubdomain = require('express-subdomain');
// const app = express()
// const port = 3001

// require('./config/db')

// const Tenant = require('./models/tenant')
// const {tenantDb , centralDb} = require('./middlewars/dbSwitch')
// const {auth , centralAuth} = require('./middlewars/auth')
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));



// app.use((req, res, next) => {
//     const parts = req.hostname.split('.');
//     req.subdomain = parts[0];
//     next();
//   });


//   const tenantRouter = express.Router();
// tenantRouter.use(tenantDb);

// app.get('/api/multitenant', async (req, res) => {
//     const pass = process.env.MONGODB_PASS || 'test'
//     const db = process.env.DB_NAME || 'testPass'
//   res.json({
//       pass,
//       db
//   })
// })
// const centralRouter = express.Router();
// centralRouter.use(centralDb);
// centralRouter.post('/create/tenant/:slug', centralAuth, async (req, res) => {    const tenant = new Tenant({
//         _id: new mongoose.Types.ObjectId(),
//         tenantSlug: req.params.slug
//     })
//     tenant
//         .save()
//         .then((result) => {
//             res.status(200).json({
//                 message: "Tenant Created",
//                 tenant,
//             });
//         })
//         .catch((err) => {
//             res.status(500).json(err);
//         });
// })
// tenantRouter.post('/book', auth, async (req, res, next) => {    const BookInfo = require('./tenantModels/book')
//     const book = new BookInfo({
//         _id: new mongoose.Types.ObjectId(),
//         bookName: req.body.name,
//         bookPrice: req.body.price
//     })
//     book
//     .save()
//     .then((result) => {
//         res.status(200).json({
//             message: "book Created",
//             result,
//         });
//     })
//     .catch((err) => {
//         next(err)
//     });
// })
// tenantRouter.get('/book', auth, async (req, res, next) => {    const BookInfo = require('./tenantModels/book')
//     quryMethod = BookInfo.find();
//     quryMethod
//         .select()
//         .exec()
//         .then((info) => {
//             res.status(200).json(info);
//         })
//         .catch((err) => {
//             console.log(err);
//             next(err)
//         });
// })
// app.use(expressSubdomain({ base: 'api', prefix: ':slug', router: tenantRouter }));
// // 404 handler
// // Central router


// app.use('/api', centralRouter);
// app.use((req, res, next) => {
//     const err = new Error('Not Found!');
//     err.status = 404;
//     next(err);
//   });
  
// // Global Error handler 
// app.use((err, req, res, next) => {
//     const status = err.status ? 400 : err.status || 500;
//     const message =
//       process.env.NODE_ENV === 'production' && err.status === 500
//         ? 'Something Went Wrong!'
//         : err.message;
  
//     if (status === 500) console.log(err.stack);
  
//     res.status(status).json({
//       status: status >= 500 ? 'error' : 'fail',
//       message,
//     });
//   });
// app.listen(port, () => {
//   console.log(`Multi tenant app listening at http://localhost:${port}`)
// })


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressSubdomain = require('express-subdomain');
const app = express();
const port = 3001;

require('./config/db');

const Tenant = require('./models/tenant');
const { tenantDb, centralDb } = require('./middlewars/dbSwitch');
const { auth, centralAuth } = require('./middlewars/auth');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for extracting subdomain
// app.use((req, res, next) => {
//     const parts = req.hostname.split('.');
//     req.subdomain = parts[0];
//     console.log('Subdomain:', req.subdomain);

//     next();
// });
// Middleware for extracting subdomain
app.use((req, res, next) => {
    // Log the hostname for debugging
    console.log('Hostname:', req.hostname);

    // Split the hostname to extract subdomain
    const parts = req.hostname.split('.');
    req.subdomain = parts[0];
    
    // Log the extracted subdomain
    console.log('Subdomain:', req.subdomain);

    // Continue to the next middleware
    next();
});


// Tenant Router
const tenantRouter = express.Router();
tenantRouter.use(tenantDb);

tenantRouter.post('/book', auth, async (req, res, next) => {
    const BookInfo = require('./tenantModels/book');
    const book = new BookInfo({
        _id: new mongoose.Types.ObjectId(),
        bookName: req.body.name,
        bookPrice: req.body.price
    });

    book.save()
        .then((result) => {
            res.status(200).json({
                message: "Book Created",
                result,
            });
        })
        .catch((err) => {
            next(err);
        });
});

tenantRouter.get('/book', auth, async (req, res, next) => {
    const BookInfo = require('./tenantModels/book');
    const queryMethod = BookInfo.find();

    queryMethod
        .select()
        .exec()
        .then((info) => {
            res.status(200).json(info);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
});

app.use(expressSubdomain('api', (req, res, next) => {
    const parts = req.hostname.split('.');
    req.subdomain = parts[0];
    console.log('Sggggggggggubdomain:', req.subdomain);

    next();
}, tenantRouter));

 // Use expressSubdomain middleware
app.use(expressSubdomain('api', tenantRouter));
 
// Central Router
const centralRouter = express.Router();
centralRouter.use(centralDb);

centralRouter.post('/create/tenant/:slug', centralAuth, async (req, res) => {
    const tenant = new Tenant({
        _id: new mongoose.Types.ObjectId(),
        tenantSlug: req.params.slug
    });

    tenant.save()
        .then((result) => {
            res.status(200).json({
                message: "Tenant Created",
                tenant,
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

app.use('/api', centralRouter);


app.get('/api/multitenant', async (req, res) => {
    const pass = process.env.MONGODB_PASS || 'test';
    const db = process.env.DB_NAME || 'testPass';

    res.json({
        pass,
        db
    });
});

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Not Found!');
    err.status = 404;
    next(err);
});

// Global Error handler
app.use((err, req, res, next) => {
    const status = err.status ? 400 : err.status || 500;
    const message =
        process.env.NODE_ENV === 'production' && err.status === 500
            ? 'Something Went Wrong!'
            : err.message;

    if (status === 500) console.log(err.stack);

    res.status(status).json({
        status: status >= 500 ? 'error' : 'fail',
        message,
    });
});



app.listen(port, () => {
    console.log(`Multi-tenant app listening at http://localhost:${port}`);
});
