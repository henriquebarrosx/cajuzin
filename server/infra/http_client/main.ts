import type { Logger } from '../logger/main';
import { NotFoundException } from '#exception/not_found_exception.ts';
import { BadRequestException } from '#exception/bad_request_exception.ts';
import { UnauthorizedException } from '#exception/unauthorized_exception.ts';
import { UnprocessableEntityException } from '#exception/unprocessable_entity_exception.ts';

type Providers = {
	logger: Logger;
}

export async function createHttpBunServer({ logger }: Providers) {
	logger.info('[HttpBunServer] Starting http server');

	const server = Bun.serve(
		{
			port: 3000,
			routes: {},
			fetch: () => {
				return new Response(null, { status: 404 });
			},
			error: (error) => {
				logger.error(error);

				if (error instanceof BadRequestException) {
					return Response.json({ message: error.message }, { status: error.status })
				}

				if (error instanceof UnauthorizedException) {
					return Response.json({ message: error.message }, { status: error.status })
				}

				if (error instanceof NotFoundException) {
					return Response.json({ message: error.message }, { status: error.status })
				}

				if (error instanceof UnprocessableEntityException) {
					return Response.json({ message: error.message }, { status: error.status })
				}

				return Response.json({ message: 'Internal Server Error' }, { status: 500 })
			},
		}
	)

	logger.info('[HttpBunServer] Server running at port 3000');
	return server;
}
