Response_data = {
	send: (values, res) => {
		res.json(values);
		res.end();
	},
	ok: (values, res, message, fields) => {
		let data = {
			success: true,
			status: 200,
			data: values,
			message,
			fields
		}
		res.json(data);
		res.end();
	},
	success: (values, res, message, fields) => {
		let data = {
			success: true,
			status: 201,
			data: values,
			message,
			fields
		}
		res.json(data);
		res.end();
	},
	back: (code, values, message) => {
		let data = {
			status: code,
			data: values,
			message,
		}
		return data;
	},
	error: (errcode, message, res, err) => {
		let data = {
			success: false,
			status: errcode,
			message,
			err
		}
		res.json(data);
		res.end();
	},
	done: (message, res, token) => {
		var data = {
			'success': true,
			'status': 200,
			'message': message,
			'token': token

		}
		res.json(data);
		res.end();
	}
}

module.exports = Response_data;
