document('Image')
	.oid('_id')
	.object('userid')
	.string('linkid')
	.object(sizes, 
		document()
			.object('o' 
				document()
					.number('width')
					.number('height')
					.string('name')
					.number('views')
			)
		.object('s' 
			document()
				.number('width')
				.number('height')
				.string('name')
				.number('views')
		)
	)
	.date('uploaded')
	.date('edited')
	.string('passcode')
	.boolean('deleted')

var Image = mongoose.Image;