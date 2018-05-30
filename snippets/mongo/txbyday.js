db.transactions.aggregate([
    { $match: { 'to': "0xc08e25d42f1df03d284298c316013d06ad50415b" } },
    {
        $group: {
            '_id': {
                'year': { '$year': "$block_time" },
                'month': { '$month': "$block_time" },
                'day': { '$dayOfMonth': "$block_time" }
            },
            count: { $sum: 1 }

        }
    }
])